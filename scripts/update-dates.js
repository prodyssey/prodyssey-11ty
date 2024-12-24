const fs = require("fs");
const matter = require("gray-matter");
const path = require("path");

const sourceDir = "src"; // adjust this to your source directory

function getAllMarkdownFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllMarkdownFiles(filePath, arrayOfFiles);
    } else if (file.endsWith(".md")) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

const markdownFiles = getAllMarkdownFiles(sourceDir);

markdownFiles.forEach((filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsedContent = matter(fileContent);

    if (!parsedContent.data.date) {
      const stats = fs.statSync(filePath);
      const lastModified = stats.mtime;

      parsedContent.data.date = lastModified;

      const updatedContent = matter.stringify(
        parsedContent.content,
        parsedContent.data
      );
      fs.writeFileSync(filePath, updatedContent);
      console.log(`Updated date in front matter for: ${filePath}`);
    }
  } catch (e) {
    console.error(`Error updating front matter for ${filePath}:`, e);
  }
});
