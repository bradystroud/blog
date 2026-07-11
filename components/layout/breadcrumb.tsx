import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

function cleanUpLink(link: string) {
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

const NextBreadcrumb = () => {
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
                  {cleanUpLink(link)}
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
