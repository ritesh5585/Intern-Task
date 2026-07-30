const path = require("path");
const jsSections = require("../config/js-sections"); // ✅ fix: sahi config
const { updateSections } = require("./section.service");

const jsPath = path.join(__dirname, "../../ppt-updated/global.js");

function updateJs(selectedSection) {
  updateSections(jsPath, jsSections, selectedSection, "/*", "*/");
}

module.exports = { updateJs };
