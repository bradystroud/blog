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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
          <span className="uppercase tracking-wide text-xs font-semibold text-gray-400 dark:text-gray-500">Sort</span>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            aria-label="Sort blogs"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
      </div>
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
              className="group block px-6 sm:px-8 md:px-10 py-10 mb-8 last:mb-0 bg-gray-50 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-1000 rounded-md shadow-xs transition-all duration-150 ease-out hover:shadow-md hover:to-gray-50 dark:hover:to-gray-800 hover:cursor-pointer"
            >
              <h2 className="text-gray-700 dark:text-white text-3xl title-font mb-5 transition-all duration-150 ease-out group-hover:text-blue-600 dark:group-hover:text-blue-300">
                {post.title}{" "}
                <span className="inline-block opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                  <BsArrowRight className="inline-block h-8 -mt-1 ml-1 w-auto opacity-70" />
                </span>
              </h2>
              <div className="flex items-center">
                {formattedDate && (
                  <>
                    <span className="font-bold text-gray-200 dark:text-gray-500 mx-2">—</span>
                    <p className="text-base text-gray-400 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-150">{formattedDate}</p>
                  </>
                )}
              </div>
            </a>
          </Link>
        );
      })}
    </>
  );
};
