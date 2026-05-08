import React from "react";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { Container } from "../util/container";
import { Section } from "../util/section";

interface LatestPost {
  filename: string;
  title: string;
  date?: string;
  tags?: string[];
}

interface LatestPostsProps {
  posts: LatestPost[];
}

export const LatestPosts: React.FC<LatestPostsProps> = ({ posts }) => {
  if (!posts.length) return null;

  return (
    <Section>
      <Container size="large" width="small">
        <div className="flex items-end justify-between gap-6 mb-10 pb-6 rule-bottom">
          <div>
            <span className="mono text-xs uppercase tracking-[0.18em] text-ink-mute">
              Recent writing
            </span>
            <h2
              className="title-font text-3xl sm:text-4xl leading-[1.05] text-ink mt-2"
              style={{ fontVariationSettings: '"opsz" 144, "wght" 500' }}
            >
              From the blog
            </h2>
          </div>
          <Link
            href="/blogs"
            className="group/all inline-flex items-center gap-2 mono text-xs uppercase tracking-[0.18em] text-ink-mute hover:text-accent transition-colors"
          >
            All entries
            <BsArrowRight
              className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/all:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <ol className="flex flex-col">
          {posts.map((post, idx) => {
            const date = new Date(post.date || "");
            let formattedDate = "";
            if (!isNaN(date.getTime())) {
              formattedDate = date.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
            }
            return (
              <li key={post.filename} className="rule-bottom">
                <Link
                  href={`/blogs/${post.filename}`}
                  className="group/row grid grid-cols-[auto_1fr_auto] items-baseline gap-6 py-5"
                >
                  <span className="mono text-xs tabular-nums w-10 text-right text-ink-mute">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="title-font text-xl sm:text-2xl leading-tight text-ink motion-safe:transition-[color,transform] motion-safe:duration-300 group-hover/row:text-accent motion-safe:group-hover/row:translate-x-1"
                    style={{ fontVariationSettings: '"opsz" 96, "wght" 480' }}
                  >
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 text-right">
                    {formattedDate && (
                      <time
                        dateTime={post.date || undefined}
                        className="mono text-xs tabular-nums text-ink-mute hidden sm:inline"
                      >
                        {formattedDate}
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
      </Container>
    </Section>
  );
};
