const { body, validationResult } = require('express-validator');

exports.validateRegister = () => {
  return [
    body('firstName', "First Name field can't be blank").exists().isLength({ min: 2, max: 25 }),
    body('lastName', "Last Name field can't be blank").exists().isLength({ min: 2, max: 25 }),
    body('email', "Invalid email address format").isEmail(),
    body('password').isLength({ min: 6, max: 20 })
  ];
};

exports.validateLogin = () => {
  return [
    body('email', "Invalid email address").isEmail(),
    body('password', "Password needs to be provided.").exists(),
    body('password', "Password has to be between 6 and 20 characters long.").isLength({ min: 6, max: 20 })
  ];
};

exports.validateProduct = () => {
  return [
    body('name', "Product name needs to be provided.").exists().isLength({min: 3, max: 40}),
    body('description', "Description must be between 15 and 2000 characters.").isLength({ max: 2000, min: 15 }),
    body('price', "Price must be provided.").not().isEmpty(),
    body('brandName', 'Brand field must be filled').not().isEmpty(),
    body('quantity', "Quantity field must be filled.").isInt({ min: 1, max: 5000 })
  ];
};

exports.execValidations = (req, res, next) => {
  let errorsList = [];
  let errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  };

  errors.array().map((err) => {
    return errorsList.push({ 
      field: err.param,
      msg: err.msg
    });
  });

  return res.status(422).json({ errors: errorsList });
};