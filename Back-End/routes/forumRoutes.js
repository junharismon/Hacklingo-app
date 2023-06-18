import express from "express";
import ForumController from "../controllers/forumController.js";
import userAuthentication from "../middlewares/userAuthentication.js";
const forumRouter = express.Router();

forumRouter.get("/", userAuthentication, ForumController.findAllForums);
forumRouter.get("/:id", userAuthentication, ForumController.findForumById);
forumRouter.delete("/:id", userAuthentication, ForumController.deleteForumById);
forumRouter.post("/", ForumController.insertForums);

export default forumRouter;