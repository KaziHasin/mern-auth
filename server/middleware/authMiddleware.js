import jwt from "jsonwebtoken";
import User from "../models/User.js";
import CustomErrorApi from "../errors/customError.js";

const auth = async (req, res, next) => {
  let token;
  token = req.cookies.token;

  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_TOKEN);
      req.user = await User.findById(decode.userId).select("-password");
      next();
    } catch (error) {
      next(new CustomErrorApi("Unauthorize user", 401));
    }
  } else {
    next(new CustomErrorApi("Unauthorize user", 401));
  }
};

export { auth };
