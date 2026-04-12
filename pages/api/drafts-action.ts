import type { NextApiRequest, NextApiResponse } from "next";
import { spawnSync } from "child_process";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { action, slug, feedback } = req.body ?? {};
  if (!action || !slug || typeof action !== "string" || typeof slug !== "string") {
    return res.status(400).json({ error: "Missing action or slug" });
  }

  if (action === "save-feedback") {
    const { readPipelineDraft, writePipelineDraft } = await import("../../scripts/lib/draft-pipeline");
    const draft = readPipelineDraft(slug);
    draft.frontmatter.feedback = typeof feedback === "string" ? feedback : "";
    draft.frontmatter.updatedAt = new Date().toISOString();
    writePipelineDraft(slug, draft.frontmatter, draft.body);
    return res.status(200).json({ ok: true, output: "Feedback saved." });
  }

  const command =
    action === "rewrite"
      ? ["run", "rewrite-approved-blog", "--slug", slug]
      : action === "promote"
        ? ["run", "promote-draft-to-blog", "--slug", slug]
        : null;

  if (!command) {
    return res.status(400).json({ error: "Unknown action" });
  }

  const result = spawnSync("bun", command, {
    cwd: process.cwd(),
    encoding: "utf8",
    env: process.env,
  });

  if (result.status !== 0) {
    return res.status(500).json({
      error: result.stderr || result.stdout || `Action failed: ${action}`,
    });
  }

  return res.status(200).json({
    ok: true,
    output: result.stdout.trim(),
  });
}
