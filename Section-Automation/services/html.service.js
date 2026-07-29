const path = require("path");
const sections = require("../config/sections");
const {
  readFile,
  writeFile,
  extractBlock,
  isJsCommented,
  jsCommentBlock,
  jsUncommentBlock,
} = require("../utils/file.utils");

const htmlPath = path.join(__dirname, "../../ppt-updated/index.html");

function updateHtml(selectedSection) {
  let html = readFile(htmlPath);
  // console.log(html);

  // const introEnd = "<!-- Brand Communication and Creatives -->";
  // console.log("DEBUG endMarker exact:", JSON.stringify(introEnd));
  // console.log("DEBUG endMarker indexOf:", html.indexOf(introEnd));
  // console.log(
  //   "DEBUG endMarker char codes:",
  //   [...introEnd].map((c) => c.charCodeAt(0)).join(","),
  // );

  for (const key in sections) {
    const { start, end } = sections[key];
    const block = extractBlock(html, start, end);

    if (block === null) {
      console.warn(`⚠️  Markers for "${key}" not found — skipping.`);
      continue;
    }

    const newBlock =
      key === selectedSection ? jsUncommentBlock(block) : jsCommentBlock(block);
      // console.log(newBlock);

    if (newBlock !== block) {
      const oldChunk = start + block + end;
      const newChunk = start + newBlock + end;
      html = html.replace(oldChunk, newChunk);
    }
  }
  writeFile(htmlPath, html);

}

module.exports = { updateHtml };
