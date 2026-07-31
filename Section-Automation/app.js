const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Routes
const presentationRoutes = require("./routes/presentation.routes");
const urlRoutes = require("./routes/url.routes");
const urlController = require("./controllers/url.controller");

app.use("/presentation", presentationRoutes);
app.use("/url", urlRoutes);

// Automation home
app.get("/", (req, res) => {
  res.render("index");
});

// PPT folder
const pptDir = path.join(__dirname, "../ppt-updated");

// Serve PPT page with embedded user/company params
app.get(
  "/ppt-updated/index.html/:username/:companyName",
  urlController.showPage,
);
app.get(
  "/ppt-updated/index.html/:username/:companyName/*",
  urlController.showPage,
);

// Serve PPT assets
app.use("/ppt-updated", express.static(pptDir));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
