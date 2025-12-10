/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://mockserver.himanshuat.com",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "weekly",
  priority: 0.7,
  generateIndexSitemap: false,
  // exclude: [],
  robotsTxtOptions: {
    // policies: [
    // ],
  },
};
