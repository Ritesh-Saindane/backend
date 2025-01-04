const express = require("express");
const {
  handleSignUp,
  handleSignIn,
  handleGetUserProfile,
  handleLogOutUser,
} = require("../controllers/loginController");
const upload = require("../services/utilities");
const { validateSignUp, validateSignIn } = require("../utilities/validation");
const authUser = require("../middlewares/auth");
const router = express.Router();

router.post(
  "/signup",
  upload.fields([
    { name: "profileImageUrl", maxCount: 1 },
    { name: "idImageUrl", maxCount: 1 },
  ]),
  validateSignUp,
  handleSignUp
);

router.post("/login", validateSignIn, handleSignIn);

router.get("/my-profile", authUser, handleGetUserProfile);

router.get("/logout", authUser, handleLogOutUser);

module.exports = router;
