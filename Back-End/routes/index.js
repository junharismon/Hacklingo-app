import express from "express";
import articleRouter from "./articleRoutes.js";
import commentRouter from "./commentRoutes.js";
import forumRouter from "./forumRoutes.js";
import postRouter from "./postRoutes.js";
import userRouter from "./userRoutes.js";
const router = express.Router();

router.use("/users", userRouter);
router.use("/posts", postRouter);
router.use("/forums", forumRouter);
router.use("/comments", commentRouter);
router.use("/articles", articleRouter);

export default router;