const express = require("express");
const presentationRoutes = require("./routes/presentation.routes");
const urlRoutes = require("./routes/url.routes");
const urlController = require("./controllers/url.controller");
const path = require("path");

const app = express();
const pptDir = path.join(__dirname, "../ppt-updated");

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/ppt-updated", express.static(pptDir));

app.set("views", path.join(__dirname, "views"));

app.use("/presentation", presentationRoutes);
app.use("/url", urlRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.get(
  "/ppt-updated/index.html/:username/:companyName",
  urlController.showPage,
);

app.listen(3000, () => {
  console.log(`Server Running on http://localhost:3000`);
});
