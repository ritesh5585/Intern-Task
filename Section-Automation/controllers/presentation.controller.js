const { updateHtml } = require("../services/html.service");

exports.updatePresentation = (req, res) => {
  const { section } = req.body;

  if (!section) {
    return res.status(400).send("Section is required");
  }

  try {
    updateHtml(section);
    res.send(`Section "${section}" activated successfully`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update presentation");
  }
};
