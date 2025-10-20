// /components/NextBreadcrumb.tsx
"use client";

import React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

function cleanUpLink(link: string) {
  return link
    .split("-")
    .map((word) => {
      if (word === "and" || word === "or" || word === "the") {
        return word;
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
    })
    .join(" ");
}

const NextBreadcrumb = () => {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);
  return (
    pathNames.length > 0 && (
      <div className="mx-20">
        <ul className="flex py-5">
          <li className="hover:opacity-70 hover:underline mx-2">
            <Link href={"/"} aria-label="Go to home page">
              <FaHome className="mt-1" />
            </Link>
          </li>
          {pathNames.map((link, index) => {
            const href = `/${pathNames.slice(0, index + 1).join("/")}`;
            const itemClasses =
              paths === href
                ? "opacity-70 cursor-default"
                : "hover:opacity-70 hover:underline";

            return (
              <React.Fragment key={index}>
                <li aria-hidden="true" className="mx-2">
                  /
                </li>
                <li className="mx-2">
                  <Link className={itemClasses} href={href}>
                    {cleanUpLink(link)}
                  </Link>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    )
  );
};

export default NextBreadcrumb;
