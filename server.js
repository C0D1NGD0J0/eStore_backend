const express = require("express");
const logger = require("morgan");
const colors = require("colors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const PORT = (process.env.PORT || 5000);
const authRoute = require("./app/Routes/auth");
const userRoute = require("./app/Routes/users");
const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  app.use(logger('dev'));
};

// MIDDLEWARE

// DATABASE CONNECTION
require("./app/Database/")();

// MODELS
require("./app/Models/User");

// ROUTES
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);

// ERROR HANDLING

// SERVER INIT
const server = app.listen(PORT, () =>{
  console.log(`Server is currently running on port ${PORT}`.white.bold.underline);
});

// unhandled promise rejection
process.on("unhandledRejection", (err, promise) =>{
  console.log(`Error: ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});