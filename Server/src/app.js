const express = require("express");
 const excelRouter = require('./routes/excel.route')
const authRouter = require('./routes/auth.route')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', excelRouter)
app.use('/api/auth', authRouter)

module.exports = app;
