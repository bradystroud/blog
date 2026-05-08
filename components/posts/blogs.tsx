import React, { useMemo, useState } from "react";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

interface BlogSysMeta {
  filename: string;
}

interface BlogNode {
  _sys: BlogSysMeta;
  id?: string;
  title: string;
  date?: string | null;
  tags?: string[];
}

interface BlogEdge {
  node: BlogNode;
}

interface BlogsProps {
  data: BlogEdge[];
}

type SortMode = "newest" | "oldest" | "title";

const MAX_TAGS = 10;

export const Blogs: React.FC<BlogsProps> = ({ data }) => {
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const { node } of data) {
      for (const tag of node.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((a, b) =>
      b[1] - a[1] || a[0].localeCompare(b[0])
    );
  }, [data]);

  const visibleTags = useMemo(() => {
    if (showAllTags) return tagCounts;
    const top = tagCounts.slice(0, MAX_TAGS);
    if (activeTag && !top.some(([t]) => t === activeTag)) {
      const found = tagCounts.find(([t]) => t === activeTag);
      if (found) top.push(found);
    }
    return top;
  }, [tagCounts, activeTag, showAllTags]);

  const hiddenTagCount = Math.max(0, tagCounts.length - MAX_TAGS);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((edge) => {
      if (activeTag && !(edge.node.tags ?? []).includes(activeTag)) return false;
      if (!q) return true;
      const haystack = [
        edge.node.title,
        ...(edge.node.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [data, activeTag, query]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    switch (sortMode) {
      case "oldest":
        return copy.sort((a, b) => {
          const da = new Date(a.node.date || 0).getTime();
          const db = new Date(b.node.date || 0).getTime();
          return da - db;
        });
      case "title":
        return copy.sort((a, b) => a.node.title.localeCompare(b.node.title));
      case "newest":
      default:
        return copy.sort((a, b) => {
          const da = new Date(a.node.date || 0).getTime();
          const db = new Date(b.node.date || 0).getTime();
          return db - da;
        });
    }
  }, [filtered, sortMode]);

  return (
    <>
      <div className="mb-6">
        <label className="relative block">
          <span className="sr-only">Search entries</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles and tags…"
            className="w-full rounded-full border border-rule bg-paper py-3 pl-12 pr-10 text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:border-rule-strong transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-full text-ink-mute hover:text-accent"
            >
              ×
            </button>
          )}
        </label>
      </div>

      {visibleTags.length > 0 && (
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            aria-pressed={activeTag === null}
            className={`inline-flex items-center rounded-full border px-3.5 py-1.5 mono text-[0.65rem] uppercase tracking-[0.12em] transition-colors ${
              activeTag === null
                ? "border-transparent bg-accent text-accent-ink"
                : "border-rule text-ink-soft hover:border-rule-strong"
            }`}
          >
            All
            <span className="ml-2 tabular-nums opacity-70">
              {data.length}
            </span>
          </button>
          {visibleTags.map(([tag, count]) => {
            const active = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(active ? null : tag)}
                aria-pressed={active}
                className={`inline-flex items-center rounded-full border px-3.5 py-1.5 mono text-[0.65rem] uppercase tracking-[0.12em] transition-colors ${
                  active
                    ? "border-transparent bg-accent text-accent-ink"
                    : "border-rule text-ink-soft hover:border-rule-strong hover:text-accent"
                }`}
              >
                {tag}
                <span className="ml-2 tabular-nums opacity-70">
                  {count}
                </span>
              </button>
            );
          })}
          {hiddenTagCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAllTags((v) => !v)}
              aria-expanded={showAllTags}
              className="inline-flex items-center rounded-full border border-dashed border-rule-strong px-3.5 py-1.5 mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-mute hover:text-accent hover:border-accent transition-colors"
            >
              {showAllTags ? "Show fewer" : `Show all ${tagCounts.length} tags`}
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8 pb-6 rule-bottom">
        <div
          role="status"
          aria-live="polite"
          className="mono text-xs uppercase tracking-[0.18em] text-ink-mute"
        >
          <span className="tabular-nums text-ink-soft">{String(sorted.length).padStart(2, "0")}</span>{" "}
          {sorted.length === 1 ? "entry" : "entries"}
          {activeTag && (
            <>
              {" / tagged "}
              <span className="text-accent">{activeTag}</span>
            </>
          )}
        </div>
        <label className="inline-flex items-center gap-3 mono text-xs uppercase tracking-[0.18em] text-ink-mute">
          Sort
          <span className="relative inline-flex">
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="appearance-none bg-transparent border-b border-rule py-2 pl-0 pr-6 text-sm font-medium text-ink focus:outline-none focus:border-rule-strong"
              aria-label="Sort blogs"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title A–Z</option>
            </select>
            <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-ink-mute">
              ↓
            </span>
          </span>
        </label>
      </div>

      {sorted.length === 0 ? (
        <p className="py-12 text-center text-ink-mute">
          No entries match this filter.
        </p>
      ) : (
        <ol className="flex flex-col">
          {sorted.map((edge, idx) => {
            const post = edge.node;
            const date = new Date(post.date || "");
            const hasDate = !isNaN(date.getTime());
            const fullDate = hasDate
              ? date.toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "";
            const compactDate = hasDate
              ? date.toLocaleDateString("en-US", {
                  month: "short",
                  year: "2-digit",
                })
              : "";
            return (
              <li key={post._sys.filename} className="rule-bottom">
                <Link
                  href={`/blogs/` + post._sys.filename}
                  className="group/row grid grid-cols-[auto_1fr_auto] items-baseline gap-4 sm:gap-6 py-6"
                >
                  <span className="mono text-xs tabular-nums w-8 sm:w-10 text-right text-ink-mute">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h2
                    className="title-font text-xl sm:text-3xl leading-tight text-ink motion-safe:transition-[color,transform] motion-safe:duration-300 group-hover/row:text-accent motion-safe:group-hover/row:translate-x-1"
                    style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "wght" 480' }}
                  >
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-3 sm:gap-4 text-right">
                    {hasDate && (
                      <time
                        dateTime={post.date || undefined}
                        className="mono text-xs tabular-nums text-ink-mute"
                      >
                        <span className="sm:hidden">{compactDate}</span>
                        <span className="hidden sm:inline">{fullDate}</span>
                      </time>
                    )}
                    <BsArrowRight
                      className="h-4 w-4 text-ink-mute motion-safe:transition-[color,transform] motion-safe:duration-300 group-hover/row:text-accent motion-safe:group-hover/row:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
};
