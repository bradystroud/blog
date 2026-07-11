import React from "react";
import { Layout } from "../components/layout";
import { Section } from "../components/util/section";
import { Container } from "../components/util/container";
import { Seo, SITE, buildOgImageUrl } from "../components/seo";
import { Actions } from "../components/util/actions";

/*
  /design — a living style guide for the "Brady Stroud" design language
  (Direction 1b, "Cool & Precise"). Public on purpose: copy tokens, fonts and
  component patterns straight from here when building something new on-brand.

  Colour swatches use hard-coded hex so the reference shows *both* themes at
  once, independent of the current mode. Everything else reads live tokens.
*/

const PAGE_DESCRIPTION =
  "The Brady Stroud design language — colours, type, spacing and components. Copy the tokens and build on-brand.";

type Swatch = { name: string; token: string; hex: string; ring?: boolean };

const LIGHT: Swatch[] = [
  { name: "Background", token: "--paper", hex: "#FCFCFD", ring: true },
  { name: "Surface", token: "--surface", hex: "#FFFFFF", ring: true },
  { name: "Ink", token: "--ink", hex: "#14161C" },
  { name: "Muted", token: "--ink-soft", hex: "#565D6B" },
  { name: "Subtle", token: "--ink-mute", hex: "#9AA0AB" },
  { name: "Border", token: "--rule", hex: "#EAEBEF", ring: true },
  { name: "Border strong", token: "--rule-strong", hex: "#D9DCE3", ring: true },
  { name: "Accent", token: "--accent", hex: "#3B5BDB" },
  { name: "Accent weak", token: "--accent-weak", hex: "#EEF1F7", ring: true },
];

const DARK: Swatch[] = [
  { name: "Background", token: "--paper", hex: "#0E1116" },
  { name: "Surface", token: "--surface", hex: "#161A21" },
  { name: "Ink", token: "--ink", hex: "#E6E9EF" },
  { name: "Muted", token: "--ink-soft", hex: "#97A0B0" },
  { name: "Subtle", token: "--ink-mute", hex: "#626C7C" },
  { name: "Border", token: "--rule", hex: "#232A34" },
  { name: "Border strong", token: "--rule-strong", hex: "#2C333F" },
  { name: "Accent", token: "--accent", hex: "#6E8BF5" },
  { name: "Accent weak", token: "--accent-weak", hex: "#1A2233" },
];

const SPACING = [4, 8, 12, 16, 24, 32, 48, 64];
const RADII = [
  { label: "6", value: "6px" },
  { label: "8", value: "8px" },
  { label: "12", value: "12px" },
  { label: "pill", value: "999px" },
];

const PRINCIPLES = [
  {
    title: "One accent, used sparingly",
    body: "A single blue carries links, active states and highlights. Everything else is ink on paper. If two things are blue, ask which one matters more.",
  },
  {
    title: "Type does the hierarchy",
    body: "Space Grotesk for display, Schibsted Grotesk for reading, JetBrains Mono for labels, dates and code. Weight and size — not colour — separate levels.",
  },
  {
    title: "Whitespace is a feature",
    body: "Generous padding and clear rules between sections. Let content breathe rather than boxing everything in.",
  },
  {
    title: "Mono for metadata",
    body: "Dates, tags, counts, eyebrows and section labels are uppercase JetBrains Mono with wide tracking. It reads as 'system chrome', distinct from prose.",
  },
  {
    title: "Numbered, indexed lists",
    body: "Posts and highlights lead with a two-digit index (01, 02…). It signals a curated, ordered collection.",
  },
];

const TOKENS_CSS = `:root {
  --paper: #FCFCFD;   --surface: #FFFFFF;
  --ink: #14161C;     --ink-soft: #565D6B;  --ink-mute: #9AA0AB;
  --rule: #EAEBEF;    --rule-strong: #D9DCE3;
  --accent: #3B5BDB;  --accent-ink: #FFFFFF; --accent-weak: #EEF1F7;
}
html.dark {
  --paper: #0E1116;   --surface: #161A21;
  --ink: #E6E9EF;     --ink-soft: #97A0B0;  --ink-mute: #626C7C;
  --rule: #232A34;    --rule-strong: #2C333F;
  --accent: #6E8BF5;  --accent-ink: #0E1116; --accent-weak: #1A2233;
}

/* Fonts */
--font-display: "Space Grotesk";    /* headings, wordmark */
--font-sans:    "Schibsted Grotesk"; /* body & UI */
--font-mono:    "JetBrains Mono";    /* code, labels, dates */`;

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mono mb-8 text-xs uppercase tracking-[0.18em] text-ink-mute flex items-center gap-3">
    <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
    {children}
  </div>
);

const SwatchGrid: React.FC<{ label: string; items: Swatch[] }> = ({ label, items }) => (
  <div>
    <div className="mono mb-5 text-[0.7rem] uppercase tracking-[0.16em] text-ink-mute">
      {label}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map((s) => (
        <div key={label + s.token}>
          <div
            className="h-16 rounded-lg"
            style={{
              backgroundColor: s.hex,
              boxShadow: s.ring ? "inset 0 0 0 1px rgba(20,22,28,0.12)" : undefined,
            }}
          />
          <div className="mt-2.5 text-[0.8rem] font-semibold text-ink">{s.name}</div>
          <div className="mono text-[0.7rem] text-ink-mute">{s.token}</div>
          <div className="mono text-[0.7rem] text-ink-mute uppercase">{s.hex}</div>
        </div>
      ))}
    </div>
  </div>
);

const Block: React.FC<{ letter: string; title: string; children: React.ReactNode }> = ({
  letter,
  title,
  children,
}) => (
  <section className="pt-14 mt-14 rule-top first:mt-0 first:pt-0 first:border-t-0">
    <div className="flex items-center gap-3 mb-10">
      <span className="inline-flex h-7 items-center justify-center rounded-md bg-ink px-2.5 mono text-xs font-semibold text-paper">
        {letter}
      </span>
      <h2 className="title-font text-2xl font-bold tracking-[-0.02em] text-ink">{title}</h2>
    </div>
    {children}
  </section>
);

export default function DesignPage() {
  const canonicalUrl = `${SITE.url}/design`;
  const ogImageUrl = buildOgImageUrl({
    title: "Design System",
    description: "The Brady Stroud design language.",
  });

  return (
    <Layout>
      <Seo
        title={`Design System | ${SITE.name}`}
        description={PAGE_DESCRIPTION}
        canonicalUrl={canonicalUrl}
        ogImageUrl={ogImageUrl}
        ogImageAlt="Brady Stroud design system"
      />
      <Section>
        <Container size="large" width="medium">
          {/* Intro */}
          <div className="mb-4">
            <Eyebrow>Design System · Cool &amp; Precise</Eyebrow>
            <h1 className="title-font text-5xl sm:text-6xl font-bold tracking-[-0.03em] text-ink">
              bradystroud<span className="text-accent">.</span>dev
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft max-w-2xl">
              The design language behind this site — colours, type, spacing and
              components. It&apos;s public so it&apos;s easy to copy: grab the tokens
              below and build something new that already feels on-brand.
            </p>
          </div>

          {/* Colours */}
          <Block letter="C" title="Colour">
            <div className="grid gap-12 lg:grid-cols-2">
              <SwatchGrid label="Light" items={LIGHT} />
              <SwatchGrid label="Dark" items={DARK} />
            </div>
          </Block>

          {/* Typography */}
          <Block letter="T" title="Typography">
            <div className="flex flex-col divide-y divide-[color:var(--rule)]">
              <div className="pb-8">
                <div className="title-font text-4xl font-bold tracking-[-0.03em] text-ink">
                  Space Grotesk
                </div>
                <div className="mono mt-3 text-xs text-ink-mute">
                  Display / headings · 700 · tracking −0.02 to −0.03em · 40/36/28/24
                </div>
              </div>
              <div className="py-8">
                <div className="text-2xl leading-snug text-ink">
                  Schibsted Grotesk — the quick brown fox jumps over the lazy dog.
                </div>
                <div className="mono mt-3 text-xs text-ink-mute">
                  Body / UI · 400–600 · 19/18/16/15/14 · line-height 1.72
                </div>
              </div>
              <div className="pt-8">
                <div className="mono text-lg text-ink">JetBrains Mono — const x = 42;</div>
                <div className="mono mt-3 text-xs text-ink-mute">
                  Code / labels / dates · 400–600 · uppercase + wide tracking for chrome
                </div>
              </div>
            </div>

            {/* Type scale */}
            <div className="mt-12">
              <div className="mono mb-5 text-[0.7rem] uppercase tracking-[0.16em] text-ink-mute">
                Scale
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { size: "text-5xl", label: "Display" },
                  { size: "text-3xl", label: "Heading" },
                  { size: "text-2xl", label: "Subhead" },
                  { size: "text-lg", label: "Lead" },
                  { size: "text-base", label: "Body" },
                ].map((row) => (
                  <div key={row.label} className="flex items-baseline gap-6">
                    <span className="mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-mute w-20 shrink-0">
                      {row.label}
                    </span>
                    <span className={`title-font font-bold tracking-[-0.02em] text-ink ${row.size}`}>
                      Aa
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Block>

          {/* Spacing & radius */}
          <Block letter="S" title="Spacing & Radius">
            <div className="mono mb-5 text-[0.7rem] uppercase tracking-[0.16em] text-ink-mute">
              Spacing scale (px)
            </div>
            <div className="flex items-end gap-3 mb-12 flex-wrap">
              {SPACING.map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div
                    className="w-3 rounded-[2px] bg-accent"
                    style={{ height: `${s + 12}px` }}
                  />
                  <span className="mono text-[0.65rem] text-ink-mute">{s}</span>
                </div>
              ))}
            </div>
            <div className="mono mb-5 text-[0.7rem] uppercase tracking-[0.16em] text-ink-mute">
              Radius
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {RADII.map((r) => (
                <div key={r.label} className="flex flex-col items-center gap-2">
                  <div
                    className="h-12 w-16 border border-rule-strong bg-accent-weak"
                    style={{ borderRadius: r.value }}
                  />
                  <span className="mono text-[0.65rem] text-ink-mute">{r.label}</span>
                </div>
              ))}
            </div>
          </Block>

          {/* Components */}
          <Block letter="U" title="Components">
            <div className="flex flex-col gap-10">
              <div className="flex flex-wrap items-center gap-4">
                <Actions
                  actions={[
                    { label: "Primary button", type: "button", icon: true, link: "/design" },
                    { label: "Text link", type: "link", icon: true, link: "/design" },
                  ]}
                />
                <span className="inline-flex items-center rounded-full border border-rule px-3.5 py-1.5 mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-soft">
                  tag chip
                  <span className="ml-2 tabular-nums opacity-70">12</span>
                </span>
                <code className="mono text-sm rounded-[5px] bg-accent-weak px-2 py-0.5 text-accent">
                  inline code
                </code>
                <span className="mono text-sm font-semibold text-accent">01 — index</span>
              </div>

              {/* Numbered index row */}
              <div className="rule-top">
                <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-6 py-5 rule-bottom">
                  <span className="mono text-sm font-semibold text-accent w-7">01</span>
                  <div>
                    <div className="title-font text-lg font-semibold tracking-[-0.01em] text-ink">
                      A numbered index row
                    </div>
                    <div className="text-sm text-ink-soft">
                      Title, one-line description, and a date on the right.
                    </div>
                  </div>
                  <span className="mono text-xs text-ink-mute whitespace-nowrap">Jul 2026</span>
                </div>
              </div>

              {/* AI collaboration callout (full text, matches article pages) */}
              <div>
                <div className="mono mb-3 text-[0.7rem] uppercase tracking-[0.16em] text-ink-mute">
                  AI collaboration callout
                </div>
                <aside className="rounded-xl border border-rule bg-accent-weak/70 px-5 py-4 flex flex-col gap-1.5 max-w-xl">
                  <span className="mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent flex items-center gap-2">
                    <span aria-hidden="true">✦</span> AI collaboration
                  </span>
                  <span className="text-sm leading-relaxed text-ink-soft">
                    Drafted with AI support; ideas, experiences and opinions are mine.
                  </span>
                </aside>
              </div>
            </div>
          </Block>

          {/* Principles */}
          <Block letter="P" title="Principles">
            <ol className="flex flex-col">
              {PRINCIPLES.map((p, i) => (
                <li
                  key={p.title}
                  className="grid grid-cols-[auto_1fr] items-baseline gap-6 py-6 rule-bottom"
                >
                  <span className="mono text-xs tabular-nums w-8 text-right text-ink-mute">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="title-font text-xl font-semibold tracking-[-0.02em] text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-ink-soft max-w-2xl">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Block>

          {/* Tokens */}
          <Block letter="{ }" title="Tokens">
            <p className="text-base leading-relaxed text-ink-soft max-w-2xl mb-6">
              Drop these CSS custom properties into a project and the rest of the
              system falls into place. Light and dark are the same tokens, re-pointed.
            </p>
            <pre className="overflow-auto rounded-[10px] bg-[#111827] p-5 text-[13px] leading-relaxed text-[#E4E8F0]">
              <code className="mono">{TOKENS_CSS}</code>
            </pre>
          </Block>
        </Container>
      </Section>
    </Layout>
  );
}
