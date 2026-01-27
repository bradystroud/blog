import { Hero } from "../components/blocks/hero";
import { Layout } from "../components/layout";
import Head from "next/head";

export default function FourOhFour() {
  return (
    <Layout>
      <Head>
        <title>404 - Page Not Found | Brady Stroud</title>
        <meta name="description" content="This page could not be found." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Hero
        data={{
          color: "default",
          headline: "404 – Page Not Found",
          text: "Oops! It seems there's nothing here, how embarrassing.",
          actions: [
            {
              label: "Return Home",
              type: "button",
              icon: true,
              link: "/",
            },
          ],
        }}
        parentField=""
      />
    </Layout>
  );
}
