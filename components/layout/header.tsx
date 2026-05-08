import React, { useState } from "react";
import { useRouter } from "next/router";
import { Container } from "../util/container";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

export const Header = ({ data }) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  return (
    <header className="relative rule-bottom">
      <Container size="custom" className="py-0 relative z-10 max-w-8xl">
        <nav
          className="flex items-center justify-between flex-wrap px-6 py-5"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className="group flex items-baseline gap-3 shrink-0 mr-6"
          >
            <span
              className="title-font text-2xl leading-none text-ink"
              style={{ fontVariationSettings: '"opsz" 144, "wght" 560' }}
            >
              Brady Stroud
            </span>
            <span className="mono text-[0.65rem] uppercase tracking-[0.18em] text-ink-mute hidden sm:inline">
              .dev
            </span>
          </Link>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-full border border-rule hover:border-rule-strong transition-colors"
            aria-label={expanded ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={expanded}
            aria-controls="nav-menu"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
          </button>

          <div
            className={`w-full md:w-auto ${expanded ? "" : "hidden md:flex"} md:items-center`}
            id="nav-menu"
          >
            <ul className="flex flex-col md:flex-row md:items-center gap-1 md:gap-8 mt-4 md:mt-0">
              {data?.nav?.map((item, i) => {
                const activeItem =
                  item.href === ""
                    ? router.asPath === "/"
                    : router.asPath.includes(item.href);
                return (
                  <li key={i}>
                    <Link
                      href={"/" + item.href}
                      className={`relative inline-block py-3 md:py-1 text-sm font-medium transition-colors hover:text-accent ${
                        activeItem ? "text-accent" : "text-ink-soft"
                      }`}
                      {...(activeItem ? { "aria-current": "page" as const } : {})}
                    >
                      {item.label}
                      {activeItem && (
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </Container>
    </header>
  );
};
