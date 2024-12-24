const chokidar = require("chokidar");
const fs = require("fs");
const matter = require("gray-matter");
const path = require("path");

// Keep track of file contents to detect real changes
const fileContents = new Map();

// Initialize watcher
const watcher = chokidar.watch("src/**/*.md", {
  persistent: true,
  ignoreInitial: true,
});

// On file change
watcher.on("change", (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsedContent = matter(fileContent);

    // Get the content without frontmatter
    const currentContent = parsedContent.content.trim();

    // Check if content has actually changed
    if (fileContents.get(filePath) !== currentContent) {
      // Update the last modified date
      parsedContent.data.date = new Date();

      // Write back to file
      const updatedContent = matter.stringify(
        parsedContent.content,
        parsedContent.data
      );
      fs.writeFileSync(filePath, updatedContent);
      console.log(`Updated date in front matter for: ${filePath}`);

      // Store new content
      fileContents.set(filePath, currentContent);
    }
  } catch (e) {
    console.error(`Error updating front matter for ${filePath}:`, e);
  }
});

console.log("Watching for markdown file changes...");
