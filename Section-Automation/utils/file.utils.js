const fs = require("fs");

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

function extractBlock(content, startMarker, endMarker) {
  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) return null;

  const endIndex = content.indexOf(endMarker, startIndex + startMarker.length);
  if (endIndex === -1) return null;

  return content.substring(startIndex + startMarker.length, endIndex);
}

// ---- HTML comment helpers ----
function isCommented(block) {
  const trimmed = block.trim();
  return trimmed.startsWith("<!--") && trimmed.endsWith("-->");
}

function commentBlock(block) {
  if (isCommented(block)) return block;
  return `\n<!--\n${block.trim()}\n-->\n`;
}

function uncommentBlock(block) {
  let trimmed = block.trim();
  if (!isCommented(trimmed)) return block;
  trimmed = trimmed.slice(4, -3);
  return `\n${trimmed.trim()}\n`;
}

// ---- JS comment helpers ----
function isJsCommented(block) {
  const trimmed = block.trim();
  return trimmed.startsWith("/*") && trimmed.endsWith("*/");
}

function jsCommentBlock(block) {
  if (isJsCommented(block)) return block;
  return `\n/*\n${block.trim()}\n*/\n`;
}

function jsUncommentBlock(block) {
  let trimmed = block.trim();
  if (!isJsCommented(trimmed)) return block;
  trimmed = trimmed.slice(2, -2);
  return `\n${trimmed.trim()}\n`;
}

module.exports = {
  readFile,
  writeFile,
  extractBlock,
  isCommented,
  commentBlock,
  uncommentBlock,
  isJsCommented,
  jsCommentBlock,
  jsUncommentBlock,
};