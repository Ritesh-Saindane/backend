const User = require("../models/user");

const handleSignUp = async (req, res) => {
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

module.exports = { handleSignUp };
