import React from "react";
import Head from "next/head";
import { Header } from "./header";
import { Footer } from "./footer";
import layoutData from "../../content/global/index.json";
import NextBreadcrumb from "./breadcrumb";

export const Layout = ({ data = layoutData, children }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Brady Stroud" key="desc" />
        <meta property="og:site_name" content="Brady Stroud" />
        <meta property="og:url" content="https://bradystroud.dev/" />
        <meta property="og:type" content="website" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="robots" content="index, follow" />{" "}
        <link rel="alternate" type="application/rss+xml" title="Brady Stroud's Blog" href="/rss.xml" />
      </Head>
      <div suppressHydrationWarning>
        <Header data={data?.header} />
        <main role="main" className="flex-1 text-gray-800 flex flex-col">
          <NextBreadcrumb />
          {children}
        </main>
        <Footer
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={data?.footer}
        />
      </div>
    </>
  );
};
