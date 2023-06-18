import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

class CommentController {
  static async findCommentById(req, res, next) {
    try {
      if (req.params.id.length !== 24) {
        throw { name: "NotFound" };
      }
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
        throw { name: "NotFound" };
      }
      res.status(200).json(comment);
    } catch (err) {
      next(err);
    }
  }

  static async insertNewComment(req, res, next) {
    try {
      const newComment = new Comment({ ...req.body, userId: req.userId });
      const user = await User.findById(req.userId);
      const post = await Post.findById(req.body.postId);
      await newComment.save();
      user.comments.push(newComment._id);
      post.comments.push(newComment._id);
      await user.save({ validateBeforeSave: false });
      await post.save({ validateBeforeSave: false });
      res.status(201).json(newComment);
    } catch (err) {
      next(err);
    }
  }

  static async updateCommentById(req, res, next) {
    try {
      const updatedComment = await Comment.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );
      res.status(200).json(updatedComment);
    } catch (err) {
      next(err);
    }
  }

  static async deleteCommentById(req, res, next) {
    try {
      const deleted = await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json({
        message: `Comment with id ${req.params.id} has been deleted`,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default CommentController;
