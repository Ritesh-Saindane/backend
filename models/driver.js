const { Schema, model } = require("mongoose");
const { createToken } = require("../services/auth");
const { randomBytes, createHmac } = require("crypto");

const driverSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: Number,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    docs: {
      profileImageUrl: {
        type: String,
        required: true,
      },
      aadharImageUrl: {
        type: String,
      },
    },
    details: {
      vehicleNo: { type: String, required: true },
      chassisNo: { type: String, required: true },
      registrationCertificateUrl: { type: String, required: true },
      licenseImageUrl: {
        type: String,
        required: true,
      },
    },
    ridesAcceptedUrl: {
      type: [Schema.Types.ObjectId],
      ref: "ride",
    },
    rating: {
      type: Number,
      default: 0,
    },
    currentLocation: {
      type: Number,
      // required: true,
    },
  },
  { timestamps: true }
);

driverSchema.pre("save", function (next) {
  const driver = this;

  if (!driver.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");

  const hashedPassword = createHmac("sha256", salt)
    .update(driver.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

driverSchema.static("addDriverAndGenerateToken", async function (driverData) {
  const {
    fullName,
    email,
    password,
    mobileNo,
    gender,
    vehicleNo,
    chassisNo,
    registrationCertificateUrl,
    licenseImageUrl,
    profileImageUrl,
    aadharImageUrl,
  } = driverData;

  try {
    const newDriver = await this.create({
      fullName,
      email,
      password,
      mobileNo,
      gender,
      docs: {
        profileImageUrl: profileImageUrl,
        aadharImageUrl: aadharImageUrl,
      },
      details: {
        vehicleNo,
        chassisNo,
        registrationCertificateUrl: registrationCertificateUrl,
        licenseImageUrl: licenseImageUrl,
      },
    });

    const token = createToken(newDriver);
    return token;
  } catch (err) {
    throw new Error(err.message);
  }
});

const Driver = model("driver", driverSchema);

module.exports = Driver;
