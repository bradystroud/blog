import React from "react";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { Layout } from "./layout";
import { Section } from "./util/section";
import { Container } from "./util/container";

export function DraftsLogin() {
  return (
    <Layout>
      <Head>
        <title>Drafts Login | Brady Stroud</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Section className="flex-1">
        <Container size="small" width="small">
          <div className="mx-auto mt-20 max-w-sm rounded-3xl border border-gray-200/80 bg-white/90 p-8 shadow-sm dark:border-gray-800/70 dark:bg-gray-950/70">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Drafts
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Sign in with GitHub to view drafts.
            </p>
            <button
              onClick={() => signIn("github")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sign in with GitHub
            </button>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}
