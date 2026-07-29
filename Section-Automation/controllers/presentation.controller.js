const fs = require("fs");
const path = require("path");

exports.updatePresentation = (req, res) => {
  const { section } = req.body;

  const htmlPath = path.join(__dirname, "../../ppt-updated/index.html");

  const html = fs.readFileSync(htmlPath, "utf8");
  console.log("selected: ", section);
  console.log("Data connected", html);

  res.send("HTML Loaded Successfully");
};
