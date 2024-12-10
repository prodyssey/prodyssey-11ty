const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Add dateFilter
  eleventyConfig.addFilter("dateFilter", function (date, format) {
    return DateTime.fromJSDate(date).toFormat(format || "dd LLLL yyyy");
  });

  // Add lastModifiedDate filter
  eleventyConfig.addFilter("lastModifiedDate", function (filename) {
    const stats = fs.statSync(filename);
    return DateTime.fromJSDate(stats.mtime).toFormat("yyyy-LL-dd");
  });

  // Add DateTime to Nunjucks environment
  eleventyConfig.addNunjucksGlobal("DateTime", DateTime);

  // Add take filter to limit the number of items in a collection
  eleventyConfig.addFilter("take", function (array, limit) {
    return array.slice(0, limit);
  });

  // Add limit filter
  eleventyConfig.addFilter("limit", function (array, limit) {
    return array.slice(0, limit);
  });

  eleventyConfig.addCollection("servicePillars", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/service-pillars/*.md");
  });

  eleventyConfig.addCollection("serviceCategories", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/service-categories/*.md");
  });

  eleventyConfig.addCollection("services", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/services/*.md");
  });

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md");
  });

  // Add custom filters
  eleventyConfig.addFilter("filterByPillar", function (categories, pillar) {
    return categories.filter((category) => category.data.pillar === pillar);
  });

  eleventyConfig.addFilter("filterByCategory", function (services, category) {
    return services.filter(
      (service) =>
        service.data.category.toLowerCase() === category.toLowerCase()
    );
  });

  // Copy `src/assets` to `_site/assets`
  eleventyConfig.addPassthroughCopy("src/assets/images/*");

  // Set custom directories for input, output, includes, and data
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    // Set template formats
    templateFormats: ["md", "njk", "html"],
    // Set as Nunjucks template engine
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };

  // Add GA4 ID to global data
  eleventyConfig.addGlobalData("ga4Id", process.env.GA4_ID || "");
};
