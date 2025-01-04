const express = require("express");
const { handleSignUp } = require("../controllers/loginController");
const upload = require("../services/utilities");

const router = express.Router();

router.post(
  "/signup",
  upload.fields([
    { name: "profileImageUrl", maxCount: 1 },
    { name: "idImageUrl", maxCount: 1 },
  ]),
  handleSignUp
);

module.exports = router;
