const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const ErrorResponse = require("../middleware/errorResponse");
const cartService = require("../services/cartService");

const clientSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid Email"],
    },
    phoneNumber: {
      type: String,
      //unique: true,
      // sparse: true, // only enforce uniqueness on docs where phoneNumber exists
    },
    address: {
      county: String,
      subCounty: String,
      ward: String,
      area: String,
      additionalDetails: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password should be atleast 6 characters long"],
    },
    confirmPassword: {
      type: String,
      minlength: [6, "Password should be atleast 6 characters long"],
    },
    membership: {
      type: String,
      enum: ["diamond", "gold", "silver", "bronze"],
      default: "bronze",
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
    },
    orders: {
      type: [{ type: Schema.Types.ObjectId, ref: "Order" }],
      default: [],
    },
    favouriteProducts: {
      type: [{ type: Schema.Types.ObjectId, ref: "Product" }],
      default: [],
    },
    role: {
      type: [String],
      default: ["client"],
      enum: ["client", "admin"],
    },
    flagged: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: [String],
      default: [],
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

clientSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  if (this.password === this.confirmPassword) {
    this.confirmPassword = undefined;
    next();
  } else {
    return next(new ErrorResponse("Passwords do not match", 400));
  }
});

clientSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const password = await bcrypt.hash(this.password, salt);
    this.password = password;
    next();
  } catch (error) {
    console.log("Failed to hash the password", error.message);
    next(error);
  }
});

clientSchema.post("save", async function (doc) {
  if (!doc.cart) {
    const cart = await cartService.createCart(doc._id);
    doc.cart = cart._id;
    await doc.save();
    console.log("User has been assigned a cart");
  }
});

clientSchema.statics.login = async function (email, password) {
  if (email === "" && password === "") throw new ErrorResponse("Fields are empty", 400);
  if (email === "") throw new ErrorResponse("Please enter your email", 400);
  if (password === "") throw new ErrorResponse("Please enter your password", 400);

  const user = await this.findOne({ email });
  if (user) {
    const matchedUser = await bcrypt.compare(password, user.password);
    if (matchedUser) {
      return user;
    }
    throw new ErrorResponse("Password is incorrect", 400);
  }
  throw new ErrorResponse("Email is incorrect", 400);
};

const Client = mongoose.model("Client", clientSchema);
module.exports = Client;
