/** @type {import('next-sitemap').IConfig} */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const siteUrl = "https://bradystroud.dev";
const siteOrigin = new URL(siteUrl).origin;

const normalizeSitemapPath = (canonicalUrl) => {
  if (typeof canonicalUrl !== "string" || !canonicalUrl.trim()) {
    return null;
  }

  try {
    const url = new URL(canonicalUrl, siteUrl);
    if (url.origin !== siteOrigin) {
      return null;
    }

    return url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "");
  } catch {
    return null;
  }
};

const blogCanonicalPathMap = new Map();
const validBlogPaths = new Set();
const blogsDir = path.resolve(process.cwd(), "content", "blogs");

if (fs.existsSync(blogsDir)) {
  const blogFiles = fs
    .readdirSync(blogsDir)
    .filter((file) => /\.mdx?$/.test(file));

  for (const file of blogFiles) {
    const { data } = matter.read(path.join(blogsDir, file));
    const filenamePath = `/blogs/${file.replace(/\.mdx?$/, "")}`;
    const canonicalPath = normalizeSitemapPath(data.canonicalUrl);
    validBlogPaths.add(filenamePath);

    if (canonicalPath && canonicalPath !== filenamePath) {
      blogCanonicalPathMap.set(filenamePath, canonicalPath);
    }
  }
}

module.exports = {
  siteUrl,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  output: "standalone",
  transform: async (config, currentPath) => {
    if (
      currentPath.startsWith("/blogs/") &&
      !validBlogPaths.has(currentPath)
    ) {
      return null;
    }

    const mappedPath = blogCanonicalPathMap.get(currentPath) ?? currentPath;

    return {
      loc: mappedPath,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/404", "/500"],
      },
    ],
  },
};
