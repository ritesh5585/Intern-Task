const path = require("path");
const jsSections = require("../config/sections");
const {
  readFile,
  writeFile,
  extractBlock,
  jsCommentBlock,
  jsUncommentBlock,
} = require("../utils/file.utils");

const jsPath = path.join(__dirname, "../../ppt-updated/global.js");

function updateJs(selectedSection) {
  let js = readFile(jsPath);
  let foundAnySection = false;

  for (const key in jsSections) {
    const { start, end } = jsSections[key];
    const block = extractBlock(js, start, end);
    if (block === null) {
      continue;
    }

    foundAnySection = true;
    const newBlock =
      key === selectedSection ? jsUncommentBlock(block) : jsCommentBlock(block);

    if (newBlock !== block) {
      js = js.replace(start + block + end, start + newBlock + end);
    }
  }

  if (!foundAnySection) {
    return false;
  }

  writeFile(jsPath, js);
  return true;
}

module.exports = { updateJs };
