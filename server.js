const express = require("express");
const logger = require("morgan");
const colors = require("colors");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = (process.env.PORT || 5000);
const authRoute = require("./app/Routes/auth");
const userRoute = require("./app/Routes/users");
const orderRoute = require("./app/Routes/orders");
const productRoute = require("./app/Routes/products");
const paymentRoute = require("./app/Routes/payments");
const reviewRoute = require("./app/Routes/reviews");
const categoryRoute = require("./app/Routes/categories");
const errorHandler = require("./app/Utils/errorsHandler");
const app = express();  

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  app.use(logger('dev'));
};

// MIDDLEWARE
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DATABASE CONNECTION
require("./app/Database/")();

// MODELS
require("./app/Models/User");
require("./app/Models/Product");
require("./app/Models/Order");
require("./app/Models/Category");


// ROUTES
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/payments", paymentRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/categories", categoryRoute);

// ERROR HANDLING
app.use(errorHandler);

// SERVER INIT
const server = app.listen(PORT, () =>{
  console.log(`Server is currently running on port ${PORT}`.white.bold.underline);
});

// unhandled promise rejection
process.once("unhandledRejection", (err, promise) =>{
  console.log(`Error: ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});