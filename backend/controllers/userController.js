const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

//Register a user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  console.log("Vinay");
  console.log(req.body);
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "This is sample Id",
      url: "profileurl",
    },
  });

  const token = user.getJWTToken();
  res.status(201).json({
    success: true,
    token,
  });
  sendToken(user, 201, res);
  // res.json({
  //     "message":"done"
  // })
});

//Login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
  console.log("Login Start");
  const { email, password } = req.body;
  //cheaking if user has given password and email both
  console.log(`email::${email}  password :: ${password}`);
  console.log(!email || !password);
  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email and Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  console.log("USER ::", user);
  if (!user) {
    return next(new ErrorHander("User not found!! Please Signup user", 404));
  }
  console.log("&&& ", password);

  const isPasswordMatched = await user.comparePassword(password);
  console.log(">>>>>>> ", isPasswordMatched);
  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid Email or Password", 401));
  }

  // const token = user.getJWTToken();
  // res.status(201).json({
  //     success:true,
  //     user,
  //     token
  // });

  sendToken(user, 200, res);
});

//Logout
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Loged Out",
  });
});

//Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  console.log(">>>>>>", req.body);
  const user = await User.findOne({ email: req.body.email });
  console.log("User ", user);
  if (!user) {
    return next(new ErrorHander("User no found", 404));
  }
  //get reset password token
  const resetToken = user.getResetPasswordToken();
  console.log("resetToken ===>>>  ", resetToken);
  await user.save({ validateBeforeSave: false });

  // const resetPasswordUrl = `http://localhost:8080/resetpassword/${resetToken}`;
  // const resetPasswordUrl=`http://localhost:3030/user/password/reset/${resetToken}`;
  //const resetPasswordUrl = `${req.protocol}://${req.get("host")}/user/password/reset/${resetToken}`;
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it`;
  console.log(message);
  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPassswordToken = undefined;
    user.resetPassswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHander(error.message, 500));
  }
});

//Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHander("Password does not matched with Confirm Password", 400)
    );
  }
  console.log("req.params.token ", req.params.token);
  //creating token hash
  const resetPassswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log("resetPassswordToken ::", resetPassswordToken);

  const user = await User.findOne({
    resetPassswordToken,
    resetPassswordExpire: { $gt: Date.now() },
  });

  console.log("user ", user);
  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is Invalid or Has been expired",
        400
      )
    );
  }

  user.password = req.body.password;
  user.resetPassswordToken = undefined;
  user.resetPassswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

//get User Details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  console.log("req.user.id", req.user.id);
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//update User password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  console.log("User ::", user);
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  console.log("is Password Matched ::", isPasswordMatched);
  if (!isPasswordMatched) {
    return next(new ErrorHander("Old Password is Incorrect", 401));
  }
  console.log("old  ::", req.body.oldPassword);
  console.log("new ::", req.body.newPassword);
  console.log("req.body.confirmPassword ::", req.body.confirmPassword);

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("password does not match", 400));
  }
  user.password = req.body.newPassword;

  await user.save();
  sendToken(user, 200, res);
});

//update User profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  console.log("email ::", req.body);
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  console.log("newUserData ::", newUserData);

  //we will add cloudinary later
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    newUserData,
  });
});

//Get all Users(by admin)
exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//Get single User(by admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHander(`User does not exist with id :: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//update User (admin)
// exports.updateUserRole = catchAsyncError(async (req, res, next) => {
//   console.log("email ::", req.body);
//   const userData = {
//     name: req.body.name,
//     email: req.body.email,
//     role: req.body.role,
//   };
//   console.log("Admin Update User Data ::", userData);
//   console.log("Admin Update this Id data ::", req.params.id);

//   //we will add cloudinary later
//   const user = await User.findByIdAndUpdate(req.params.id, userData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   res.status(200).json({
//     success: true,
//     message: "User Updated Successfully",
//   });
// });

//Delete User (admin)
// exports.deleteUser = catchAsyncError(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   if (!user) {
//     return next(
//       new ErrorHander(`User does not exist with id ${req.params.id}`, 404)
//     );
//   }

//   await user.remove();

//   res.status(200).json({
//     success: true,
//     message: "User Deleted Successfully",
//   });
// });
