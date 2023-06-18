import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

async function userAuthorization(req, res, next) {
  try {
    // We pass the current user id as req.headers
    // We check if the input params actually exists
    const userId = req.userId;
    if (req.params.id.length !== 24) {
      throw { name: "NotFound" };
    }
    const user = await User.findById(req.params.id);
    // If current user doesnt match the id of to-be-updated user, throw 401
    if (!user) {
      throw { name: "NotFound" };
    }
    // If current user doesnt match the id of to-be-updated user, throw 403
    if (user._id.toString() !== userId) {
      throw { name: "Forbidden" };
    }
    next();
  } catch (err) {
    next(err);
  }
}

async function postAuthorization(req, res, next) {
  try {
    // We pass the current user id as req.headers
    // We check if the input params actually exists
    const userId = req.userId;
    if (req.params.id.length !== 24) {
      throw { name: "NotFound" };
    }
    const post = await Post.findById(req.params.id);
    // If current user doesnt match the id of to-be-updated post, throw 401
    if (!post) {
      throw { name: "NotFound" };
    }
    // If current user doesnt match the id of to-be-updated post, throw 403
    if (post.userId.toString() !== userId) {
      throw { name: "Forbidden" };
    }
    next();
  } catch (err) {
    next(err);
  }
}

async function commentAuthorization(req, res, next) {
  try {
    // We pass the current user id as req.headers
    // We check if the input params actually exists
    const userId = req.userId;
    if (req.params.id.length !== 24) {
      throw { name: "NotFound" };
    }
    const comment = await Comment.findById(req.params.id);
    // If current user doesnt match the id of to-be-updated comment, throw 401
    if (!comment) {
      throw { name: "NotFound" };
    }
    // If current user doesnt match the id of to-be-updated comment, throw 403
    if (comment.userId.toString() !== userId) {
      throw { name: "Forbidden" };
    }
    next();
  } catch (err) {
    next(err);
  }
}

export {userAuthorization, postAuthorization, commentAuthorization};
