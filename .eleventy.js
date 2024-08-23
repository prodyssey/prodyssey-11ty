const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
    
    // Add dateFilter
    eleventyConfig.addFilter("dateFilter", function(date, format) {
        return DateTime.fromJSDate(date).toFormat(format || "dd LLLL yyyy");
    });

    // Add lastModifiedDate filter
    eleventyConfig.addFilter("lastModifiedDate", function(filename) {
        const stats = fs.statSync(filename);
        return DateTime.fromJSDate(stats.mtime).toFormat("yyyy-LL-dd");
    });

    // Add DateTime to Nunjucks environment
    eleventyConfig.addNunjucksGlobal("DateTime", DateTime);


    // Add limit filter
    eleventyConfig.addFilter("limit", function(array, limit) {
        return array.slice(0, limit);
    });
    
    // Set custom directories for input, output, includes, and data
    return {
      dir: {
        input: "src",
        output: "_site",
        includes: "_includes",
        data: "_data"
      },
      // Set template formats
      templateFormats: [
        "md",
        "njk",
        "html"
      ],
      // Set as Nunjucks template engine
      markdownTemplateEngine: "njk",
      htmlTemplateEngine: "njk",
      dataTemplateEngine: "njk"
    };
  };