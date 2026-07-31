const path = require("path");
const slugify = require("../utils/slugify");

exports.generateUrl = (req, res) => {
  try {
    const { userName, companyName, section } = req.body;

    if (!userName || !companyName || !section) {
      return res
        .status(400)
        .send("User name, company name and section are required.");
    }

    const usernameSlug = slugify(userName);
    const companySlug = slugify(companyName);

    console.log("User:", userName);
    console.log("Company:", companyName);
    console.log("Section:", section);

    const url = `/ppt-updated/index.html/${usernameSlug}/${companySlug}`;

    return res.redirect(url);
  } catch (error) {
    console.error("URL generation failed:", error);

    return res.status(500).send("Failed to generate presentation URL.");
  }
};

exports.showPage = (req, res) => {
  const { username, companyName } = req.params;
  console.log("User:", username);
  console.log("Company:", companyName);

  const htmlPath = path.join(__dirname, "..", "..", "ppt-updated", "index.html");
  return res.sendFile(htmlPath);
};
