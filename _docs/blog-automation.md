# Blog Automation

This repo now includes a local, code-first workflow for turning recent git activity into a private draft pipeline before anything becomes a public blog post.

## Goals

- Find blog-worthy work across repos under `~/Developer` or a narrower root.
- Prefer interesting engineering stories over raw commit summaries.
- Keep pipeline artifacts separate from public blog posts.
- Use AI only after a human approves a story candidate.
- Promote finished articles into `content/blogs` only when they are ready.

## Content model

### Public content

- `content/blogs/`
  - real public blog posts only
  - shown on `/blogs`
  - included in RSS

### Private draft pipeline

- `content/drafts/`
  - internal workflow items only
  - used for research notes, AI-written drafts, and done/history state

## Draft stages

Draft pipeline items use:

- `research` - commit/repo evidence and suggested angle
- `blog-draft` - AI has rewritten it into an article draft
- `done` - promoted into a real public blog post

Suggested UI grouping later:

- Research
- Blog draft
- Done

## Commands

### Run tests for the automation

```bash
bun run test:blog-automation
```

### Generate research drafts from recent repo activity

```bash
bun run generate-blog-drafts
```

Useful flags:

```bash
bun run generate-blog-drafts --days 30 --limit 3 --minScore 12
bun run generate-blog-drafts --rootDir ~/Developer/bradystroud --repo blog --dryRun true
```

Options:

- `--rootDir <path>`: root folder to scan for git repos
- `--repo <name-or-relative-path>`: scan one repo only
- `--days <n>`: only inspect commits in the last `n` days
- `--limit <n>`: max number of generated drafts
- `--minScore <n>`: minimum score required to generate a draft
- `--dryRun true`: print candidate output without writing files

### Rewrite an approved research draft with AI

Once a research item exists and you approve the idea, run:

```bash
bun run rewrite-approved-blog --slug why-i-built-blog
```

If you've added reviewer feedback on the `/drafts` page, the rewrite step will include that feedback in the prompt for the next AI pass.

Optional flags:

```bash
bun run rewrite-approved-blog --slug why-i-built-blog --model gpt-5-mini --nextStatus review
bun run rewrite-approved-blog --slug why-i-built-blog --nextStatus published
```

Requirements:

- `OPENAI_API_KEY` must be available in the environment
- the target draft pipeline item should currently be `research` or `blog-draft`
- the AI rewrite overwrites the same file under `content/drafts/`
- after rewrite, the pipeline item moves to `stage: blog-draft`
- the rewrite uses a dedicated writing guide plus the most relevant previous blog posts for style/context

### Promote a finished draft into a public blog post

```bash
bun run promote-draft-to-blog --slug why-i-built-blog
```

This will:

- take the AI-written blog content from `content/drafts/<slug>.mdx`
- write a public post to `content/blogs/<slug>.mdx`
- mark the pipeline item as `stage: done`
- store the published blog slug in the draft pipeline file

## How the scoring works

The scanner looks for signals such as:

- new repos
- multiple recent commits
- broad file changes
- AI/dev-tooling themes
- automation/workflow keywords
- refactor/architecture changes
- bug-fix/debugging clues
- docs or visual asset updates

The result is a ranked list of story candidates, not a blind conversion of every commit into a blog post.

## Generated research draft structure

A generated research draft includes:

- frontmatter with title, slug, stage, score, source repos, source commits, tags, and timestamps
- why the candidate looked interesting
- the commits that triggered the draft
- files worth mentioning
- a suggested post structure
- a rough starter body

## Example workflow

1. Run the generator in dry-run mode:

```bash
bun run generate-blog-drafts --rootDir ~/Developer/bradystroud --days 30 --limit 5 --dryRun true
```

2. Generate real research items:

```bash
bun run generate-blog-drafts --rootDir ~/Developer/bradystroud --days 30 --limit 2
```

3. Review the generated files under `content/drafts/`
4. Approve an idea and run the AI rewrite:

```bash
bun run rewrite-approved-blog --slug why-i-built-blog
```

5. Review/edit the AI-written article draft
6. Promote it to a real public post:

```bash
bun run promote-draft-to-blog --slug why-i-built-blog
```

7. Public blog listing and RSS continue to read only from `content/blogs/`

## Private review page

A draft review page now exists at:

- `/drafts`

If `DRAFTS_SECRET` is set in the environment, the page requires:

- `/drafts?secret=your-secret`

The page groups items into:

- Research
- Blog Draft
- Done

and shows the next CLI action for each item.

## TinaCMS note

Adding the new draft collection changes the Tina GraphQL schema.

That means `tinacms build` may fail until the remote Tina schema is updated/indexed for the branch. In practice, the code/test workflow can still be validated locally, but the full Tina build/deploy path needs the schema sync step.

## Security note

A hidden route is not real security on its own. If you later add a `/drafts` or `/blogs/drafts` review page on a public deployment, protect it with real auth (preview-only deploy, middleware, password gate, etc.), not just an obscure URL.

## Future ideas

- build a private `/drafts` review UI grouped by stage
- add approve/regenerate/promote buttons
- scheduled local run via cron or launchd
- repo allowlist / ignore list
- better grouping of related commits into one story
- richer prompts per post type (new project, debugging story, automation workflow, refactor write-up)
- PR/issue metadata as extra signal
