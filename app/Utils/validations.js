const { check, validationResult } = require('express-validator');

exports.validateRegister = () => {
  return [
    check('firstName', "First Name field can't be blank").exists().isLength({ min: 2, max: 25 }),
    check('lastName', "Last Name field can't be blank").exists().isLength({ min: 2, max: 25 }),
    check('email', "Invalid email address format").isEmail().normalizeEmail(),
    check('password').isLength({ min: 6, max: 20 })
  ];
};

exports.validateLogin = () => {
  return [
    check('email', "Invalid email address").isEmail(),
    check('password', "Password needs to be provided.").exists(),
    check('password', "Password has to be between 6 and 20 characters long.").isLength({ min: 6, max: 20 })
  ];
};

exports.execValidations = (req, res, next) => {
  let errorsList = [];
  let errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  };

  errors.array().map((err) => {
    return errorsList.push({ [err.param]: err.msg });
  });

  return res.status(422).json({ errors: errorsList });
};