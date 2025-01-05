const Driver = require("../models/driver");
const { validationResult } = require("express-validator");

const handleDriverSignup = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (
      !req.files ||
      !req.files.profileImage ||
      !req.files.aadharImage ||
      !req.files.registrationCertificate ||
      !req.files.licenseImage
    ) {
      throw new Error("All images are required");
    }

    const profileImagePath = req.files.profileImage[0].path;
    const aadharImagePath = req.files.aadharImage[0].path;
    const registrationCertificatePath =
      req.files.registrationCertificate[0].path;
    const licenseImagePath = req.files.licenseImage[0].path;

    const token = await Driver.addDriverAndGenerateToken({
      ...req.body,
      profileImageUrl: profileImagePath,
      aadharImageUrl: aadharImagePath,
      registrationCertificateUrl: registrationCertificatePath,
      licenseImageUrl: licenseImagePath,
    });

    res.status(201).json({ msg: "success", token });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = { handleDriverSignup };
