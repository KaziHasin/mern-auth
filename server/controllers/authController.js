import asyncWrapper from "../middleware/asyncWrapper.js";
import CustomErrorApi from "../errors/customError.js";
import fileUpload from "../utilities/fileUpload.js";
import sendResetLing from "../utilities/sendResetLing.js";
import generateToken from "../utilities/generateToken.js";
import removeToken from "../utilities/removeToken.js";
import fs, { unlinkSync } from "fs";
import User from "../models/User.js";

// @desc register new user
// @route api/v1/auth/register
// @access public route
const register = async (req, res, next) => {
  fileUpload()(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Image upload failed", error: err });
    }

    // const profileImage = req.file ? req.file.path : "";
    const profileImage = req.file
      ? req.file.path.replace(/\\/g, "/").replace(/^server\//, "")
      : "";

    const { username, email, password } = req.body;

    try {
      const existsUser = await User.findOne({ email });
      if (existsUser) {
        unlinkSync(req.file.path);
        return next(
          new CustomErrorApi("Email address is already registered", 400)
        );
      }

      const user = await User.create({
        username,
        email,
        password,
        profileImage,
      });

      if (user) {
        generateToken(res, user._id);
        res.status(201).json({
          message: "User created successfully",
          data: {
            _id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
          },
        });
      } else {
        return next(new CustomErrorApi("Invalid user data", 400));
      }
    } catch (error) {
      next(error);
    }
  });
};

// @desc login the user
// @route api/v1/auth/login
// @access public route
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      next(new CustomErrorApi("Email and Password must be provided", 400));
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.status(201).json({
        message: "User login successfully",
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
        },
      });
    } else {
      return next(new CustomErrorApi("Invalid user data", 401));
    }
  } catch (error) {
    next(error);
  }
};

// @desc logout the user
// @route api/v1/auth/logout
// @access private route
const logout = asyncWrapper(async (req, res) => {
  if (removeToken(res)) {
    res.status(201).json({
      message: "User logged out",
    });
  }
});

// @desc reset password the user
// @route api/v1/auth/reset-password
// @access public route
const resetPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return next(new CustomErrorApi("Email does not exist", 404));
  }
  const result = await sendResetLing(existingUser);

  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    return next(new CustomErrorApi(result.message, 500));
  }
});

// @desc send reset link to the user email
// @route POST api/v1/auth/generate-new-password
// @param crypto token
// @access public route
const generateNewPassword = asyncWrapper(async (req, res, next) => {
  const { token } = req.params;

  const tokenUser = await User.findOne({
    resetPasswordToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!tokenUser) {
    next(
      new CustomErrorApi(
        "Reset token not valid or expire, please try again",
        401
      )
    );
  }

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    next(
      new CustomErrorApi("Password and confirm password did not match.", 400)
    );
  }

  tokenUser.password = password;
  (tokenUser.resetPasswordToken = undefined),
    (tokenUser.resetTokenExpire = undefined),
    await tokenUser.save();

  res.status(200).json({
    message:
      "Your password reset successfully, now you can login with new password",
  });
});

// @desc change password the user
// @route POST api/v1/auth/change-password
// @access private route
const changePassword = asyncWrapper(async (req, res, next) => {
  const {
    user: { _id: userId },
  } = req;
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  if (user && (await user.matchPassword(oldPassword))) {
    user.password = newPassword;
    await user.save();
    if (removeToken(res)) {
      res.status(200).json({
        message: "Password changed",
      });
    }
  } else {
    return next(new CustomErrorApi("Invalid password", 401));
  }
});

// @desc get user profile
// @route api/v1/profile
// @access private route
const getProfile = asyncWrapper(async (req, res, next) => {
  const user = {
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    profileImage: req.user.profileImage,
  };
  res.status(200).send({ user });
});

// @desc update profile of the user
// @route api/v1/profile
// @access private route
const updateProfile = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    (user.username = req.body.username || user.username),
      (user.email = req.body.email || user.email);

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    removeToken(res);

    res.status(200).json({
      updatedUser,
      message: "Profile updated successfully",
    });
  } else {
    next(new CustomErrorApi("No user found", 401));
  }
});

// @desc update the image of the user
// @route api/v1/profile/image
// @access private route
const updateImage = asyncWrapper(async (req, res, next) => {
  const { user } = req;

  fileUpload()(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Image upload failed", error: err });
    }
    if (user.profileImage) {
      unlinkSync(user.profileImage);
    }
    user.profileImage = req.file ? req.file.path : "";
    await user.save();
    res.status(200).json({
      profileImage: user.profileImage,
      message: "Profile image changed successfully",
    });
  });
});

// @desc delete the user
// @route api/v1/profile
// @access private route
const deleteUser = asyncWrapper(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);
  removeToken(res);

  res.status(200).json({ user, message: "User deleted successfully" });
});

export {
  register,
  login,
  logout,
  resetPassword,
  generateNewPassword,
  changePassword,
  getProfile,
  updateProfile,
  updateImage,
  deleteUser,
};
