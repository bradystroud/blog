import React from "react";
import { Container } from "../../util/container";
import { options } from "../../../tina/collections/global";

export const Footer = ({ data }) => {
  const year = new Date().getFullYear();
  return (
    <footer className="rule-top mt-24">
      <Container className="relative py-12" size="small">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-soft">
            Built and tinkered with by Brady. Thanks for stopping by.
          </p>
          <nav
            aria-label="Social media links"
            className="flex gap-2"
          >
            {data?.social?.map((social) => {
              if (!social?.platform) return null;
              const option = options.find((o) => o.value === social.platform);
              return (
                <a
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rule text-ink-mute hover:text-accent hover:border-rule-strong motion-safe:transition-colors motion-safe:duration-300"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={`social-link-${social.platform}`}
                  aria-label={`${option?.label || social.platform} (opens in new tab)`}
                >
                  {option?.icon}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="mt-10 pt-6 rule-top flex flex-wrap items-center justify-between gap-4 mono text-xs uppercase tracking-[0.18em] text-ink-mute">
          <span>&copy; {year} Brady Stroud</span>
          <span aria-hidden="true">{"//"}</span>
          <a
            href="/rss.xml"
            className="hover:text-accent transition-colors"
          >
            RSS
          </a>
        </div>
      </Container>
    </footer>
  );
};
