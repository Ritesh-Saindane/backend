const { Router } = require("express");
const {
  handleDriverSignup,
  //   handleDriverLogIn,
  //   handleGetDriverProfile,
} = require("../controllers/driverController");
const router = Router();
const {
  validateDriverSignUp,
  validateDriverSignIn,
} = require("../utilities/validation");
const uploads = require("../services/utilities");

router.post(
  "/signup",
  uploads.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "aadharImage",
      maxCount: 1,
    },
    {
      name: "registrationCertificate",
      maxCount: 1,
    },
    {
      name: "licenseImage",
      maxCount: 1,
    },
  ]),
  validateDriverSignUp,
  handleDriverSignup
);

// router.get("/login", validateDriverSignIn, handleDriverLogIn);
// router.get("/my-profile", handleGetDriverProfile);

module.exports = router;
