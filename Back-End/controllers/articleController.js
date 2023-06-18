import Article from "../models/Article.js";
import User from "../models/User.js";

class ArticleController {
  static async findArticleById(req, res, next) {
    try {
      if (req.params.id.length !== 24) {
        throw { name: "NotFound" };
      }
      const article = await Article.findById(req.params.id);
      if (!article) {
        throw { name: "NotFound" };
      }
      res.status(200).json(article);
    } catch (err) {
      next(err);
    }
  }

  static async findArticlesByTitle(req, res, next) {
    try {
      const regex = new RegExp(req.query.search, "i");
      const articles = await Article.find(
        { title: regex },
        { createdAt: 0, updatedAt: 0, __v: 0 }
      );
      res.status(200).json(articles);
    } catch (err) {
      next(err);
    }
  }

  static async insertNewArticle(req, res, next) {
    try {
      const newArticle = new Article({ ...req.body, userId: req.userId });
      const user = await User.findById(req.userId);
      await newArticle.save();
      user.articles.push(newArticle._id);
      await user.save({ validateBeforeSave: false });
      res.status(201).json(newArticle);
    } catch (err) {
      next(err);
    }
  }
}

export default ArticleController;
