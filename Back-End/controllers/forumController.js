import Forum from "../models/Forum.js";

class ForumController {
  static async findAllForums(req, res, next) {
    try {
      const forums = await Forum.find(
        {},
        { createdAt: 0, updatedAt: 0, description: 0, posts: 0 }
      ).sort({name: 1});
      res.status(200).json(forums);
    } catch (err) {
      next(err);
    }
  }

  static async findForumById(req, res, next) {
    try {
      if (req.params.id.length !== 24) {
        throw { name: "NotFound" };
      }
      const forum = await Forum.findById(req.params.id, {
        createdAt: 0,
        updatedAt: 0,
      }).populate("posts").sort({createdAt: 1});
      if (!forum) {
        throw { name: "NotFound" };
      }
      res.status(200).json(forum);
    } catch (err) {
      next(err);
    }
  }

  static async insertForums(req, res, next) {
    try {
      const forums = await Forum.bulkWrite(
        req.body.map((el) => ({
          insertOne: {
            document: el,
          },
        })),
        { ordered: true }
      );
      res.status(201).json({
        forums: forums.insertedIds,
        message: "Insert Forums Success!!",
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteForumById(req, res, next) {
    try {
      if (req.params.id.length !== 24) {
        throw { name: "NotFound" };
      }
      const deleted = await Forum.findByIdAndDelete(req.params.id);
      if (!deleted) {
        throw { name: "NotFound" };
      }
      res.status(200).json({
        message: `Forum with id ${req.params.id} has been deleted`,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default ForumController;
