#!/usr/bin/env bun
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import {
  filterNovelCandidates,
  GitCommit,
  readExistingBlogSlugs,
  readReadmeSnippet,
  RepoScanResult,
  scoreCandidate,
  sortCandidates,
  generateDraftBody,
} from "./lib/commit-to-blog";
import { createResearchDraft } from "./lib/draft-pipeline";

interface Options {
  rootDir: string;
  days: number;
  limit: number;
  minScore: number;
  outputDir: string;
  dryRun: boolean;
  repo?: string;
}

function parseArgs(argv: string[]): Options {
  const args = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
    args.set(key, value);
  }

  return {
    rootDir: path.resolve(args.get("rootDir") ?? path.resolve(process.cwd(), "..")),
    days: Number(args.get("days") ?? 21),
    limit: Number(args.get("limit") ?? 3),
    minScore: Number(args.get("minScore") ?? 12),
    outputDir: path.resolve(args.get("outputDir") ?? path.join(process.cwd(), "content", "drafts")),
    dryRun: args.get("dryRun") === "true",
    repo: args.get("repo") ?? undefined,
  };
}

function listGitRepos(rootDir: string): string[] {
  if (!fs.existsSync(rootDir)) return [];

  const directChildren = fs.readdirSync(rootDir, { withFileTypes: true });
  const repos: string[] = [];

  for (const child of directChildren) {
    if (!child.isDirectory()) continue;
    const fullPath = path.join(rootDir, child.name);
    if (fs.existsSync(path.join(fullPath, ".git"))) {
      repos.push(fullPath);
      continue;
    }

    for (const grandChild of fs.readdirSync(fullPath, { withFileTypes: true })) {
      if (!grandChild.isDirectory()) continue;
      const nestedPath = path.join(fullPath, grandChild.name);
      if (fs.existsSync(path.join(nestedPath, ".git"))) {
        repos.push(nestedPath);
      }
    }
  }

  return repos;
}

function execGit(repoPath: string, args: string[]): string {
  const result = spawnSync("git", args, {
    cwd: repoPath,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || `git ${args.join(" ")} failed in ${repoPath}`);
  }

  return result.stdout.trim();
}

function isNewRepo(repoPath: string, days: number): boolean {
  try {
    const firstCommitDate = execGit(repoPath, ["log", "--reverse", "--format=%cI", "--max-count=1"]);
    if (!firstCommitDate) return false;
    const ageMs = Date.now() - new Date(firstCommitDate).getTime();
    return ageMs <= days * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function readRecentCommits(repoPath: string, days: number): GitCommit[] {
  const delimiter = "__OPENCLAW_COMMIT__";
  const fieldSep = "__FIELD__";
  const bodyStart = "__BODY_START__";
  const bodyEnd = "__BODY_END__";
  const raw = execGit(repoPath, [
    "log",
    `--since=${days}.days`,
    `--format=${delimiter}%n%H${fieldSep}%cI${fieldSep}%s${fieldSep}${bodyStart}%b${bodyEnd}`,
    "--name-only",
  ]);

  const repoName = path.basename(repoPath);
  return raw
    .split(delimiter)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [headerLine, ...restLines] = chunk.split(/\r?\n/);
      const [hash, date, subject, bodyWithMarkers = ""] = headerLine.split(fieldSep);
      const body = bodyWithMarkers
        .replace(bodyStart, "")
        .replace(bodyEnd, "")
        .trim();
      const files = restLines
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((line) => !line.startsWith(bodyStart) && !line.endsWith(bodyEnd))
        .filter((line) => /[\\/]/.test(line) || /\.[a-z0-9]+$/i.test(line));

      return {
        hash,
        date,
        subject: subject?.trim() ?? "",
        body,
        files,
        repoName,
        repoPath,
      } satisfies GitCommit;
    })
    .filter((commit) => commit.subject);
}

function scanRepo(repoPath: string, days: number): RepoScanResult | null {
  const commits = readRecentCommits(repoPath, days);
  if (commits.length === 0) return null;

  return {
    repoName: path.basename(repoPath),
    repoPath,
    commits,
    isNewRepo: isNewRepo(repoPath, days),
    readmeSnippet: readReadmeSnippet(repoPath),
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const allRepos = options.repo ? [path.resolve(options.rootDir, options.repo)] : listGitRepos(options.rootDir);

  const scans = allRepos
    .map((repoPath) => {
      try {
        return scanRepo(repoPath, options.days);
      } catch (error) {
        console.warn(`Skipping ${repoPath}: ${(error as Error).message}`);
        return null;
      }
    })
    .filter((scan): scan is RepoScanResult => Boolean(scan));

  const candidates = sortCandidates(scans.map(scoreCandidate))
    .filter((candidate) => candidate.score >= options.minScore)
    .slice(0, options.limit);

  const existingSlugs = readExistingBlogSlugs(options.outputDir);
  const novelCandidates = filterNovelCandidates(candidates, existingSlugs);

  if (novelCandidates.length === 0) {
    console.log("No new blog-worthy repo activity found.");
    return;
  }

  for (const candidate of novelCandidates) {
    const body = generateDraftBody(candidate);
    const outputPath = path.join(options.outputDir, `${candidate.slug}.mdx`);

    console.log(`\n${candidate.title}`);
    console.log(`  score: ${candidate.score}`);
    console.log(`  repo: ${candidate.repoPath}`);
    console.log(`  reasons: ${candidate.reasons.join(", ")}`);
    console.log(`  output: ${outputPath}`);

    if (!options.dryRun) {
      createResearchDraft(candidate, body, new Date());
    }
  }

  console.log(`\nGenerated ${novelCandidates.length} draft(s).`);
}

main();
