const { body } = require("express-validator");

const validateSignUp = [
  body("fullName").notEmpty().withMessage("Full Name is required"),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .matches(/@(?:ce|it|elec|extc)\.vjti\.ac\.in$/)
    .withMessage("Email must belong to vjti.ac.in domain."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be alteast 8 chars"),
  body("mobileNo").isMobilePhone().withMessage("Mobile No is not valid"),
  body("gender")
    .isIn(["Male", "Female"])
    .withMessage("Gender must be Male or Female."),
];

const validateSignIn = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .matches(/@(?:ce|it|elec|extc)\.vjti\.ac\.in$/)
    .withMessage("Email must belong to vjti.ac.in domain."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be alteast 8 chars"),
];

module.exports = { validateSignUp, validateSignIn };
