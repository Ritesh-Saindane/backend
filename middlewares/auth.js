const User = require("../models/user");
const { getUserFromToken } = require("../services/auth");

const authUser = async (req, res, next) => {
  const token =
    req.cookies.token || req.headers.authorization?.split("Bearer")[1]; // bearer 1234;

  if (!token) return res.status(401).json({ msg: "Unauthorised" });
  try {
    const decoded_user = getUserFromToken(token);
    const user = await User.findById(decoded_user._id);
    // console.log(user);
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ msg: "Unauthorised" });
  }
};

module.exports = authUser;
