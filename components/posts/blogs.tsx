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
}

interface BlogEdge {
  node: BlogNode;
}

interface BlogsProps {
  data: BlogEdge[];
}

type SortMode = "newest" | "oldest" | "title";

export const Blogs: React.FC<BlogsProps> = ({ data }) => {
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  const sorted = useMemo(() => {
    const copy = [...data];
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
  }, [data, sortMode]);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-10">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600">
            Browse the archive
          </span>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
            Curated thoughts on engineering, design, and leadership.
          </p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
          <span className="uppercase tracking-wide text-xs font-semibold text-gray-400 dark:text-gray-500">
            Sort
          </span>
          <span className="relative inline-flex">
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="appearance-none bg-white/80 dark:bg-gray-900/60 border border-gray-200/80 dark:border-gray-700/70 rounded-lg py-2 pl-3 pr-8 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              aria-label="Sort blogs"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title A–Z</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              ▾
            </span>
          </span>
        </label>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {sorted.map((edge) => {
          const post = edge.node;
          const date = new Date(post.date || "");
          let formattedDate = "";
          if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
          }
          return (
            <Link
              key={post._sys.filename}
              href={`/blogs/` + post._sys.filename}
              passHref
              legacyBehavior
            >
              <a
                key={post.id || post._sys.filename}
                className="group relative flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white/70 p-8 shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:ring-blue-400/50 dark:border-gray-800/70 dark:bg-gray-900/60 dark:shadow-none dark:ring-white/5 dark:hover:border-blue-500/40 dark:hover:bg-gray-900/80"
              >
                <span className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-blue-400/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <h2 className="mt-4 text-2xl font-semibold text-gray-800 transition-colors duration-200 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-300">
                  {post.title}
                </h2>
                <div className="mt-4 flex items-center gap-3 text-sm text-gray-500 transition-colors duration-200 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-200">
                  {formattedDate && (
                    <time dateTime={post.date || undefined}>{formattedDate}</time>
                  )}
                  <span className="hidden h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600 sm:inline-block" />
                  <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.2em] text-blue-500/80 dark:text-blue-300/80">
                    Read story
                    <BsArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </a>
            </Link>
          );
        })}
      </div>
    </>
  );
};
