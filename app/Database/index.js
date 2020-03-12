const mongoose = require("mongoose");
const isProduction = (process.env.NODE_ENV === "production");

const connectDB = async () => {
  try {
    if (isProduction) {
      await mongoose.connect(process.env.MONGODB_URI, { 
        useNewUrlParser: true,
        useCreateIndex: true, 
        useFindAndModify: false,
        useUnifiedTopology: false
      });

      return console.log("Connected to remote database".black.bgYellow);
    } else {
      await mongoose.connect(process.env.LOCALDB_URI, { 
        useNewUrlParser: true, 
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false 
      });

      return console.log("Connected to local database".black.inverse.bgYellow);
    };
  } catch (err) {
    console.log("Database Connection Error: ".red, err);
    process.exit(1); //exit process with failure
  };
};

module.exports = connectDB;