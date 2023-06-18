import Forum from "../models/Forum.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

class PostController {
  static async findPostsBySearch(req, res, next) {
    try {
      const regex = new RegExp(req.query.search, "i");
      const posts = await Post.find({
        $and: [{ forumId: req.query.forumId }, { title: regex }],
      },
      [],
      {
        sort: {
          createdAt: -1
        }
      }
      );
      res.status(200).json(posts);
    } catch (err) {
      next(err);
    }
  }

  static async findPostById(req, res, next) {
    try {
      if (req.params.id.length !== 24) {
        throw { name: "NotFound" };
      }
      const post = await Post.findById(req.params.id).populate([
        {
          path: "comments",
          populate: {
            path: "userId",
            select: "_id username email profileImageUrl",
          },
          select: "_id content createdAt",
          options: {
            sort: { createdAt: 1 },
          },
        },
        { path: "userId", select: "_id username email profileImageUrl" },
      ]);
      if (!post) {
        throw { name: "NotFound" };
      }
      res.status(200).json(post);
    } catch (err) {
      next(err);
    }
  }

  static async insertNewPost(req, res, next) {
    try {
      const newPost = new Post({
        ...req.body,
        userId: req.userId,
        postImageUrl: req.imageUrl,
      });
      const user = await User.findById(req.userId);
      const forum = await Forum.findById(req.body.forumId);
      await newPost.save();
      user.posts.push(newPost._id);
      forum.posts.push(newPost._id);
      await user.save({ validateBeforeSave: false });
      await forum.save({ validateBeforeSave: false });
      res.status(201).json(newPost);
    } catch (err) {
      next(err);
    }
  }

  static async updatePostById(req, res, next) {
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { ...req.body, userId: req.userId, postImageUrl: req.imageUrl },
        {
          returnDocument: "after",
          runValidators: true,
        }
      );
      res.status(200).json(updatedPost);
    } catch (err) {
      next(err);
    }
  }

  static async deletePostById(req, res, next) {
    try {
      const deleted = await Post.findByIdAndDelete(req.params.id);
      res.status(200).json({
        message: `Post with id ${req.params.id} has been deleted`,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default PostController;
