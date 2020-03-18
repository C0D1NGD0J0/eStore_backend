require("dotenv").config();
const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");

const Category = require("../../Models/Category");

await mongoose.connect(process.env.LOCALDB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const categories = JSON.parse(fs.readFileSync(`${__dirname}/app/Database/seed/categories.json`, 'utf-8'));

const importData = async () => {
  try {
    await Category.create(categories);
    console.log("Category data imported".green.inverse);
    process.exit();
  } catch (err) {
    console.log("Seed Error(create): ", err);
  };
};

const deleteData = async () => {
  try {
    await Category.deleteMany();
    console.log("Category data deleted...".red.inverse);
    process.exit();
  } catch (err) {
    console.log("Seed Error(delete): ", err);
  };
};

if (process.argv[2] === "import_seed") {
  console.log("Importing...");
  importData();
} else if (process.argv[2] === 'delete_seed') {
  console.log("Deleting...");
  deleteData();
};