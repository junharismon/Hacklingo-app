import express from "express";
import CommentController from "../controllers/commentController.js";
import { commentAuthorization } from "../middlewares/authorizations.js";
import userAuthentication from "../middlewares/userAuthentication.js";
const commentRouter = express.Router();

commentRouter.get("/:id", userAuthentication, CommentController.findCommentById);
commentRouter.post("/", userAuthentication, CommentController.insertNewComment);
commentRouter.put(
  "/:id",
  userAuthentication,
  commentAuthorization,
  CommentController.updateCommentById
);
commentRouter.delete(
  "/:id",
  userAuthentication,
  commentAuthorization,
  CommentController.deleteCommentById
);

export default commentRouter;
