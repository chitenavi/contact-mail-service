const { check, validationResult } = require('express-validator');

const contactFormValidationRules = () => {
  return [
    check('name')
      .isLength({ min: 1, max: 50 })
      .withMessage('Name must have 1 to 50 characters')
      .escape()
      .trim(),
    check('email')
      .isEmail()
      .withMessage('That email does not look right')
      .bail()
      .trim()
      .normalizeEmail(),
    check('message')
      .isLength({ min: 1, max: 500 })
      .withMessage('Message must have 1 to 500 characters')
      .escape()
      .trim(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(422).json({
    status: 'fail',
    errors: errors.mapped(),
  });
};

module.exports = {
  contactFormValidationRules,
  validate,
};
