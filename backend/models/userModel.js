const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter User Name"],
    //  trim:true,
    maxLength: [20, "Can not exceed 20 characters"],
    minLength: [4, "Name should have more than 4  characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [4, "Password should be greater than 4 charactes"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token
userSchema.methods.getJWTToken = function () {
  console.log("this  ::", this);
  // return jwt.sign({id:this._id},process.env.JWT_SECRET,{
  //     expiresIn:process.env.JWT_EXPIRE,
  // })
  var payload = {
    email: this.email,
    password: this.password,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//compare password
userSchema.methods.comparePassword = async function (password) {
  console.log("entered pwd :: ", password);
  console.log("entered pwd type :: ", typeof password);
  console.log("this.password pwd :: ", this.password);
  console.log("entered pwd type :: ", typeof this.password);
  console.log(await bcrypt.compare(password, this.password));

  return await bcrypt.compare(password, this.password);
};

//Generating Password reset token
userSchema.methods.getResetPasswordToken = function () {
  //generating token
  const resetToken = crypto.randomBytes(20).toString("hex");
  console.log("--->> ", resetToken);

  //hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    
  console.log("$$$ ", this.resetPasswordToken);
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  console.log("--->> ", resetToken);
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
