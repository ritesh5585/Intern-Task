const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  "/ppt-updated",
  express.static(path.join(__dirname, "..", "ppt-updated")),
);

const routes = require("./routes/presentation.routes");
app.use("/presentation", routes);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("Server Running on 3000");
});
