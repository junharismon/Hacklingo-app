import express from "express";
import PostController from "../controllers/postController.js";
import { postAuthorization } from "../middlewares/authorizations.js";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";
import userAuthentication from "../middlewares/userAuthentication.js";
const postRouter = express.Router();

postRouter.get("/", userAuthentication, PostController.findPostsBySearch);
postRouter.get("/:id", userAuthentication, PostController.findPostById);
postRouter.post(
  "/",
  userAuthentication,
  uploadMiddleware,
  PostController.insertNewPost
);
postRouter.put(
  "/:id",
  userAuthentication,
  postAuthorization,
  uploadMiddleware,
  PostController.updatePostById
);
postRouter.delete(
  "/:id",
  userAuthentication,
  postAuthorization,
  PostController.deletePostById
);

export default postRouter;

