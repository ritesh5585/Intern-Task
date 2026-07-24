const express = require("express");
const excelRouter = require("./routes/excel.route");
const authRouter = require("./routes/auth.route");
const runsRouter = require("./routes/brandRun.route")

const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads/images", express.static(path.join(__dirname, "uploads/images")));

app.use("/api", excelRouter);
app.use("/api/auth", authRouter);
app.use("/api/runs", runsRouter)

module.exports = app;
