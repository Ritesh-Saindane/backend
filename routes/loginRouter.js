const { Router } = require("express");
const { handleSignUp } = require("../controllers/loginController");
const router = Router();

router.get("/signup", handleSignUp);

module.exports = router;
