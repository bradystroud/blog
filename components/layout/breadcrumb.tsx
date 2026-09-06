import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { SITE } from "../seo";

// Section segments whose title is not just the title-cased slug.
const SEGMENT_LABELS: Record<string, string> = { blogs: "Blog" };

function cleanUpLink(link: string) {
  if (SEGMENT_LABELS[link]) return SEGMENT_LABELS[link];
  return link
    .split("-")
    .map((word) => {
      if (word === "and" || word === "or" || word === "the") {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

// Page titles sometimes carry the site name ("Projects | Brady Stroud").
// The breadcrumb only wants the page's own name.
function stripSiteName(title: string) {
  return title
    .split("|")
    .map((part) => part.trim())
    .filter((part) => part && part !== SITE.name)
    .join(" | ");
}

type NextBreadcrumbProps = {
  /** Label for the current page. Falls back to a title-cased URL segment. */
  pageTitle?: string;
};

const NextBreadcrumb = ({ pageTitle }: NextBreadcrumbProps) => {
  const router = useRouter();
  // Defer until mounted: the home page is served at "/" but rewritten to
  // "/home", so router.asPath differs between SSR ("/home") and the client
  // ("/"). Rendering only after mount keeps server and client markup in sync.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const path = router.asPath.split("?")[0].split("#")[0];
  const pathNames = path.split("/").filter((segment) => segment);

  if (!mounted || pathNames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-6 sm:px-8">
      <ol className="flex py-5">
        <li className="hover:opacity-70 hover:underline mx-2">
          <Link href="/" aria-label="Home">
            <FaHome className="mt-1" aria-hidden="true" />
          </Link>
        </li>
        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join("/")}`;
          const isCurrentPage = path === href;
          const label =
            isCurrentPage && pageTitle
              ? stripSiteName(pageTitle) || cleanUpLink(link)
              : cleanUpLink(link);
          const itemClasses = isCurrentPage
            ? "opacity-70 cursor-default"
            : "hover:opacity-70 hover:underline";

          return (
            <React.Fragment key={index}>
              <li aria-hidden="true" className="mx-2">
                /
              </li>
              <li className="mx-2">
                <Link
                  className={itemClasses}
                  href={href}
                  {...(isCurrentPage ? { "aria-current": "page" as const } : {})}
                >
                  {label}
                </Link>
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default NextBreadcrumb;
