import mongoose from "../config/connectToMongoDB.js";
const { Schema } = mongoose;

const articleSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "User Id is required"]
    },
    content: {
      type: String,
      required: [true, "Content is required"]
    },
    title: {
      type: String,
      required: [true, "Title is required"]
    },
    articleImageUrl: {
      type: String
    }
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

export default Article;
