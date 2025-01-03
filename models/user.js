const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createToken } = require("../services/auth");

const userSchema = new Schema(
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
        default: "/images/defaultUser.png",
      },
      idImageUrl: {
        type: String,
      },
    },
    socket_id: {
      type: String,
    },
    ridesBooked: {
      type: [Schema.Types.ObjectId],
      ref: "ride",
    },
    rating: {
      type: Number,
      default: 0,
    },
    salt: {
      type: String,
    },
    profileImageUrl: {
      type: String,
      default: "/images/defaultUser.png",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

// when user first time registers :
userSchema.static("addUserAndGenerateToken", async function (dataFromUser) {
  let { fullName, email, password, mobileNo, gender } = dataFromUser.body;
  console.log("req.data", dataFromUser.files);
  try {
    const newUser = await this.create({
      fullName,
      email,
      password,
      mobileNo,
      gender,
    });

    const token = createToken(newUser);
    return token;
  } catch (e) {
    throw new Error(e.message);
  }
});

// when user log in :
userSchema.static(
  "checkPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("Email Not found");

    const salt = user.salt;
    const originalHashedPassword = user.password;

    const userProvidedPasswordConvertedToHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (originalHashedPassword != userProvidedPasswordConvertedToHash)
      throw new Error("Wrong Password");

    const token = createToken(user);
    return token;
  }
);

const User = model("user", userSchema);

module.exports = User;