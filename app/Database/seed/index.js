require("dotenv").config();
const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const slugify = require("slugify");
const Category = require("../../Models/Category");
const Product = require("../../Models/Product");
const _ = require('lodash');

//LOCALDB_URI
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const categories = JSON.parse(fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'));
const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));

const importData = async () => {
  try {
    const _savedCategories = await Category.create(categories);
    const _allSubCategories = _.flatten(_savedCategories.map(c => c.subcategories));

    const promiseArray = products.map(async (p) => {
      const matchedCat = _savedCategories.find((c) => c.slug === p.category.parentCat.toLowerCase())
      const matchedSubCat = _allSubCategories.find((subcat) => subcat.slug === p.category.subCat.toLowerCase());

      let { photo, category, ...rest } = p;
      if (matchedCat && matchedSubCat) {
        const _newProduct = await Product.create({
          ...rest,
          slug: slugify(p.name, { lower: true, replacement: '_' }),
          photos: [photo],
          category: { parentCategory: matchedCat.id, subCategory: matchedSubCat.id }
        });

        return _newProduct;
      };
    });

    await Promise.all(promiseArray);
    console.log("Category data imported".green.inverse);
    console.log("Product data imported".green.inverse);
    process.exit();
  } catch (err) {
    console.log("Seed Error(create): ", err);
  };
};

const deleteData = async () => {
  try {
    await Category.deleteMany();
    await Product.deleteMany();
    console.log("Category data deleted...".red.inverse);
    console.log("Product data deleted...".red.inverse);
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

//node app database seed.js delete_seed