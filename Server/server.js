require("dotenv").config();
const app = require("./src/app.js");
const connectDB = require("./src/config/database.js");

connectDB();

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});
