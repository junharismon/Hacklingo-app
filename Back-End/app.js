import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import errorHandler from "./middlewares/errorHandler.js";
import router from "./routes/index.js";

const app = express();

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 5mb.
    fileSize: 5 * 1024 * 1024,
  },
});

app.disable("x-powered-by");
app.use(multerMid.single("file"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello guys!!!" });
});

app.use(router);

app.use(errorHandler);

export default app;
