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
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👋🏼</text></svg>"
        />
        <meta name="robots" content="index, follow" />{" "}
      </Head>
      <div suppressHydrationWarning>
        <Header data={data?.header} />
        <div className="flex-1 text-gray-80 flex flex-col">
          <NextBreadcrumb />
          {children}
        </div>
        <Footer
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={data?.footer}
        />
      </div>
    </>
  );
};
