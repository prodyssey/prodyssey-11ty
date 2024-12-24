const chokidar = require("chokidar");
const fs = require("fs");
const matter = require("gray-matter");
const path = require("path");

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

    // Update the last modified date
    parsedContent.data.date = new Date();

    // Write back to file
    const updatedContent = matter.stringify(
      parsedContent.content,
      parsedContent.data
    );
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated date in front matter for: ${filePath}`);
  } catch (e) {
    console.error(`Error updating front matter for ${filePath}:`, e);
  }
});

console.log("Watching for markdown file changes...");
