require('dotenv').config();
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const PORT = (process.env.PORT || 5000);
const authRoute = require("./app/Routes/auth");
const userRoute = require("./app/Routes/users");
const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'));
};

// MIDDLEWARE

// DATABASE CONNECTION

// MODELS
require("./app/Models/User");

// ROUTES
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);

// ERROR HANDLING

// SERVER INIT
app.listen(PORT, () =>{
  console.log(`Server is currently running on port ${PORT}`);
});