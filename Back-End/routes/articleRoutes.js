import express from "express";
import ArticleController from "../controllers/articleController.js";
import userAuthentication from "../middlewares/userAuthentication.js";
const articleRouter = express.Router();

articleRouter.get("/", userAuthentication, ArticleController.findArticlesByTitle);
articleRouter.get("/:id", userAuthentication, ArticleController.findArticleById);
articleRouter.post("/", userAuthentication, ArticleController.insertNewArticle);

export default articleRouter;
