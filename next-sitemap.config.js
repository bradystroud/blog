/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: "https://bradystroud.dev/",
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  output: "standalone",

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
