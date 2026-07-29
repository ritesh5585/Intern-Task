const fs = require("fs");

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

// Grabs whatever sits between the two marker comments (markers excluded)
function extractBlock(content, startMarker, endMarker) {
  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) return null;

  const endIndex = content.indexOf(endMarker, startIndex + startMarker.length);
  if (endIndex === -1) return null;

  return content.substring(startIndex + startMarker.length, endIndex);
}

function isCommented(block) {
  const trimmed = block.trim();
  return trimmed.startsWith("<!--") && trimmed.endsWith("-->");
}

function commentBlock(block) {
  if (isCommented(block)) return block; // already commented, leave it
  return `\n<!--\n${block.trim()}\n-->\n`;
}

function uncommentBlock(block) {
  let trimmed = block.trim();
  if (!isCommented(trimmed)) return block; // already plain, leave it
  trimmed = trimmed.slice(4, -3); // strip <!-- and -->
  return `\n${trimmed.trim()}\n`;
}

module.exports = {
  readFile,
  writeFile,
  extractBlock,
  commentBlock,
  uncommentBlock,
  isCommented,
};
