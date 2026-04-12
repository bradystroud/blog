import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Layout } from "../../components/layout";
import { Section } from "../../components/util/section";
import { Container } from "../../components/util/container";
import { DraftsLogin } from "../../components/drafts-login";

const draftsDir = path.resolve(process.cwd(), "content", "drafts");

export default function DraftDetailPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  if (!props.authenticated) {
    return <DraftsLogin />;
  }

  return (
    <Layout>
      <Head>
        <title>{`${props.title} | Draft Preview`}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Section className="flex-1">
        <Container size="large" width="medium">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-400">Draft preview</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {props.title}
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Stage: {props.stage}</p>
            </div>
            <Link
              href={props.backHref}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
            >
              Back to drafts
            </Link>
          </div>

          <article className="rounded-3xl border border-gray-200/80 bg-white/90 p-8 shadow-sm dark:border-gray-800/70 dark:bg-gray-950/70">
            <div className="prose prose-lg max-w-none dark:prose-invert whitespace-pre-wrap">
              {props.body}
            </div>
          </article>
        </Container>
      </Section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("../api/auth/[...nextauth]");
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return { props: { authenticated: false, title: "", stage: "", body: "", backHref: "/drafts" } };
  }

  const slug = String(params?.slug ?? "");
  const filePath = path.join(draftsDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return { notFound: true };
  }

  const parsed = matter(fs.readFileSync(filePath, "utf8"));

  return {
    props: {
      authenticated: true,
      title: String(parsed.data.title ?? slug),
      stage: String(parsed.data.stage ?? "research"),
      body: parsed.content,
      backHref: "/drafts",
    },
  };
};
