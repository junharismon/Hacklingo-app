import User from "../models/User.js";

async function userAuthentication(req, res, next) {
  try {
    // We pass the current user id as req.headers
    // We check if the input header actually exists
    const userId = req.headers.userid;
    if (!userId) {
      throw { name: "Unauthorized" };
    }
    if (userId.length !== 24) {
      throw { name: "Unauthorized" };
    }
    const user = await User.findById(userId);
    if (!user) {
      throw { name: "Unauthorized" };
    }
    req.userId = userId;
    next();
  } catch (err) {
    next(err);
  }
}

export default userAuthentication;
