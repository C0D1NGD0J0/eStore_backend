require('dotenv').config();
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const PORT = (process.env.PORT || 5000);
const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'));
};

// MIDDLEWARE

// DATABASE CONNECTION

// MODELS

// ROUTES

// ERROR HANDLING

// SERVER INIT
app.listen(PORT, () =>{
  console.log(`Server is currently running on port ${PORT}`);
});