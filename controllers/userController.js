const BlackList = require("../models/blacklistToken");
const User = require("../models/user");
const { validationResult } = require("express-validator");

const handleSignUp = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, email, password, mobileNo, gender } = req.body;

    if (!req.files || !req.files.profileImageUrl || !req.files.idImageUrl) {
      throw new Error("Both profile and ID images are required.");
    }
    // console.log(req.files);

    const profileImagePath = req.files.profileImageUrl[0].path;
    const idImagePath = req.files.idImageUrl[0].path;

    // Add user and generate token
    const token = await User.addUserAndGenerateToken({
      fullName,
      email,
      password,
      mobileNo,
      gender,
      profileImagePath,
      idImagePath,
    });

    res.status(201).json({ msg: "success", token });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const handleSignIn = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let { email, password } = req.body;
  try {
    const token = await User.checkPasswordAndGenerateToken(email, password);
    // console.log(token);
    res.cookie("token", token);
    return res.status(200).json({ msg: "success", token: token });
  } catch (err) {
    return res.status(400).json({ err: err.message });
  }
};

const handleGetUserProfile = async (req, res) => {
  const user = req.user;
  return res.status(200).json(user);
};

const handleLogOutUser = async (req, res) => {
  const token =
    req.cookies?.token || req.headers.authorization.split("Bearer")[1];
  try {
    await BlackList.create({ token });
    res.clearCookie("token");
  } catch (e) {
    return res
      .status(401)
      .json({ error: `error during logout :: ${e.message} ` });
  }

  return res.status(200).json({ msg: "success" });
};

module.exports = {
  handleSignUp,
  handleSignIn,
  handleGetUserProfile,
  handleLogOutUser,
};
