const { DateTime } = require("luxon");
const fs = require("fs");
const Image = require("@11ty/eleventy-img");
const path = require("path");

async function imageShortcode(
  src,
  alt,
  sizes = "100vw",
  loading = "lazy",
  className = ""
) {
  let fullSrc;

  // Handle different src formats
  if (src.startsWith("/")) {
    // Absolute path from site root
    fullSrc = path.join("src", src.substring(1));
  } else if (src.startsWith("assets/")) {
    // Relative path starting with assets
    fullSrc = path.join("src", src);
  } else {
    // Assume it's relative to src
    fullSrc = path.join("src", src);
  }

  let metadata = await Image(fullSrc, {
    widths: [400, 800, 1200],
    formats: ["avif", "webp", "jpeg"],
    outputDir: "_site/assets/images/optimized/",
    urlPath: "/assets/images/optimized/",
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}-${width}w.${format}`;
    },
  });

  let imageAttributes = {
    alt,
    sizes,
    loading,
    decoding: "async",
  };

  if (className) {
    imageAttributes.class = className;
  }

  return Image.generateHTML(metadata, imageAttributes);
}

// Add a specialized shortcode for headshots with smaller sizes
async function headshotShortcode(
  src,
  alt,
  sizes = "192px",
  loading = "lazy",
  className = ""
) {
  const fullSrc = path.join("src", src);

  let metadata = await Image(fullSrc, {
    widths: [192, 384, 768],
    formats: ["avif", "webp", "jpeg"],
    outputDir: "_site/assets/images/optimized/",
    urlPath: "/assets/images/optimized/",
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}-${width}w.${format}`;
    },
  });

  let imageAttributes = {
    alt,
    sizes,
    loading,
    decoding: "async",
  };

  if (className) {
    imageAttributes.class = className;
  }

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
  // Determine if we're in production based on Netlify's environment variable
  const isProd = process.env.CONTEXT === "production";

  // Add this environment info to Eleventy's global data
  eleventyConfig.addGlobalData("isProd", isProd);

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

  eleventyConfig.addFilter("filterByFeatured", function (posts) {
    return posts.filter((post) => post.data.featured === true);
  });

  eleventyConfig.addFilter("getFileDate", function (path, page) {
    // Check for date in front matter first
    if (page.data.date) {
      return page.data.date;
    }

    // Fall back to file modified date
    try {
      const stats = fs.statSync(path);
      return stats.mtime;
    } catch (e) {
      console.error(`Error getting file date for ${path}:`, e);
      return new Date();
    }
  });

  // Copy `src/assets` to `_site/assets`
  eleventyConfig.addPassthroughCopy("src/assets/images/*");
  eleventyConfig.addPassthroughCopy("src/assets/page-images/*");
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicons/*": ".",
  });

  // Add GA4 ID to global data
  eleventyConfig.addGlobalData("ga4Id", process.env.GA4_ID || "");

  // Add the image shortcode
  eleventyConfig.addAsyncShortcode("image", imageShortcode);
  eleventyConfig.addAsyncShortcode("headshot", headshotShortcode);

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
};
