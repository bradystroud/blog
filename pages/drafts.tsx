import React, { useState } from "react";
import Head from "next/head";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Layout } from "../components/layout";
import { Section } from "../components/util/section";
import { Container } from "../components/util/container";
import { DraftReviewItem, groupDraftsByStage } from "../utils/draft-review";
import { loadDraftReviewItems } from "../utils/draft-review-server";
import { DraftsLogin } from "../components/drafts-login";

const stageMeta: Record<string, { title: string; description: string; accent: string }> = {
  research: {
    title: "Research",
    description: "Repo signals, commit evidence, and candidate angles waiting for approval.",
    accent: "border-amber-200 bg-amber-50 dark:border-amber-400/30 dark:bg-amber-500/10",
  },
  "blog-draft": {
    title: "Blog Draft",
    description: "AI-written articles ready for editing, polishing, and final approval.",
    accent: "border-sky-200 bg-sky-50 dark:border-sky-400/30 dark:bg-sky-500/10",
  },
  done: {
    title: "Done",
    description: "Promoted posts that already became real public blogs.",
    accent: "border-emerald-200 bg-emerald-50 dark:border-emerald-400/30 dark:bg-emerald-500/10",
  },
};

export default function DraftsPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  if (!props.authenticated) {
    return <DraftsLogin />;
  }

  const grouped = groupDraftsByStage(props.items);

  return (
    <Layout>
      <Head>
        <title>Draft Pipeline | Brady Stroud</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Section className="flex-1">
        <Container size="large" width="large">
          <div className="mb-10 rounded-3xl border border-gray-200/80 bg-white/80 p-8 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/70">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
                  Private editorial pipeline
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  Draft review board
                </h1>
                <p className="mt-3 max-w-3xl text-base text-gray-600 dark:text-gray-300">
                  This page keeps public blogs clean by separating research notes, AI-generated article drafts, and finished promotions.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200/80 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-700/70 dark:bg-gray-800/70 dark:text-gray-300">
                <div>Total items: <strong>{props.items.length}</strong></div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {(Object.keys(stageMeta) as Array<keyof typeof stageMeta>).map((stageKey) => (
              <div
                key={stageKey}
                className={`rounded-3xl border p-5 shadow-sm ${stageMeta[stageKey].accent}`}
              >
                <div className="mb-5">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stageMeta[stageKey].title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {stageMeta[stageKey].description}
                  </p>
                </div>

                <div className="space-y-4">
                  {grouped[stageKey].length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300/80 bg-white/60 p-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
                      No items yet.
                    </div>
                  ) : (
                    grouped[stageKey].map((item) => (
                      <DraftCard
                        key={item.slug}
                        item={item}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </Layout>
  );
}

function DraftCard({
  item,
}: {
  item: DraftReviewItem;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState(item.feedback || "");

  const runAction = async (action: "rewrite" | "promote" | "save-feedback") => {
    try {
      setLoading(true);
      setMessage(null);
      const response = await fetch("/api/drafts-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, slug: item.slug, feedback }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || `Action failed: ${action}`);
      }
      setMessage(payload.output || `${action} complete`);
      if (action !== "save-feedback") {
        setMessage("Done. Refreshing draft board...");
        await router.replace(router.asPath);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="rounded-2xl border border-gray-200/80 bg-white/90 p-4 shadow-sm dark:border-gray-800/70 dark:bg-gray-950/70">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
        </div>
        {typeof item.score === "number" ? (
          <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-gray-900">
            Score {item.score}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={`/drafts/${item.slug}`}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
        >
          View draft
        </Link>
        {item.publishedBlogSlug ? (
          <Link
            href={`/blogs/${item.publishedBlogSlug}`}
            className="rounded-lg border border-blue-300 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-950"
          >
            Published blog
          </Link>
        ) : null}
      </div>

      {item.stage !== "done" ? (
        <div className="mt-3 space-y-2">
          <label htmlFor={`feedback-${item.slug}`} className="sr-only">
            Feedback for {item.title}
          </label>
          <textarea
            id={`feedback-${item.slug}`}
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Feedback for next AI pass..."
            className="min-h-[60px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => runAction("save-feedback")}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
            >
              {loading ? "..." : "Save feedback"}
            </button>
            {item.stage === "research" ? (
              <button
                onClick={() => runAction("rewrite")}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "..." : "Generate draft"}
              </button>
            ) : null}
            {item.stage === "blog-draft" ? (
              <>
                <button
                  onClick={() => runAction("rewrite")}
                  disabled={loading}
                  className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
                >
                  {loading ? "..." : "Regenerate"}
                </button>
                <button
                  onClick={() => runAction("promote")}
                  disabled={loading}
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                >
                  {loading ? "..." : "Promote"}
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      {message ? (
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
          {message}
        </div>
      ) : null}
    </article>
  );
}


export async function getServerSideProps({ req, res }) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("./api/auth/[...nextauth]");
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return { props: { authenticated: false, items: [] } };
  }

  return {
    props: {
      authenticated: true,
      items: loadDraftReviewItems(),
    },
  };
}
