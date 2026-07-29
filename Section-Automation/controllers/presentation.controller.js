const { updateHtml } = require("../services/html.service");
const { updateJs } = require("../services/js.service");

exports.updatePresentation = (req, res) => {
  const { section } = req.body;
  if (!section) return res.status(400).send("Section is required");

  try {
    updateHtml(section);
    console.log(`Section "${section}" activated successfully in HTML`);

    const jsUpdated = updateJs(section);
    if (jsUpdated) {
      console.log(`Section "${section}" activated successfully in JavaScript`);
    }

    return res.redirect("/ppt-updated/index.html");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update presentation");
  }
};
