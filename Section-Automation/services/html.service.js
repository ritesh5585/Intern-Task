const path = require("path");
const sections = require("../config/sections");
const { updateSections } = require("./section.service");

const htmlPath = path.join(__dirname, "../../ppt-updated/index.html");

function updateHtml(selectedSection) {
  updateSections(htmlPath, sections, selectedSection, "<!--", "-->");
}

module.exports = { updateHtml };