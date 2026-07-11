import React, { useState } from "react";
import { useRouter } from "next/router";
import { Container } from "../util/container";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { ThemeToggle } from "./themeToggle";

export const Header = ({ data }) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const navLink = (item, i: number, block: "desktop" | "mobile") => {
    const activeItem =
      item.href === ""
        ? router.asPath === "/"
        : router.asPath.includes(item.href);
    return (
      <li key={`${block}-${i}`}>
        <Link
          href={"/" + item.href}
          onClick={() => setExpanded(false)}
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
  };

  return (
    <header className="relative rule-bottom">
      <Container size="custom" className="py-0 relative z-10 max-w-8xl">
        <nav
          className="flex items-center justify-between flex-wrap gap-y-4 px-6 py-5"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className="group flex items-baseline gap-3 shrink-0 mr-6"
            aria-label="Brady Stroud — home"
          >
            <span className="title-font text-2xl leading-none text-ink">Brady Stroud</span>
            <span className="mono text-[0.65rem] uppercase tracking-[0.18em] text-ink-mute hidden sm:inline">
              .dev
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <ul className="hidden md:flex md:items-center md:gap-8 md:mr-4">
              {data?.nav?.map((item, i) => navLink(item, i, "desktop"))}
            </ul>

            <ThemeToggle />

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-rule hover:border-rule-strong transition-colors"
              aria-label={expanded ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={expanded}
              aria-controls="nav-menu"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
            </button>
          </div>

          <div
            className={`w-full md:hidden ${expanded ? "" : "hidden"}`}
            id="nav-menu"
          >
            <ul className="flex flex-col gap-1 mt-4">
              {data?.nav?.map((item, i) => navLink(item, i, "mobile"))}
            </ul>
          </div>
        </nav>
      </Container>
    </header>
  );
};
