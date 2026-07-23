const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Database connected successfully");
    console.log("Database:", mongoose.connection.db.databaseName);
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

module.exports = connectDB;