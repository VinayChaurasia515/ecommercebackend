const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  console.log("isAuthenticatedUser start...");

  const token = req.get("token");
  //const { token } = req.cookies;
  console.log("Token :: ", token);
  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }
  console.log(">>>process.env.JWT_SECRET<<<<", process.env.JWT_SECRET);
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  console.log("DecodedData :: ", decodedData);
  req.user = await User.find({ email: decodedData.email });
  console.log("req.user*** :: ", req.user[0]);
  req.user = req.user[0];
  next();
});

exports.authorizeRoles = (...roles) => {
  console.log(...roles);
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role :: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
