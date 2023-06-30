const mongoose = require("mongoose");
require ("dotenv").config();

const { MONGO_URI } = process.env;
const uri=MONGO_URI;
exports.connect = () => {
      mongoose.connect(uri)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};