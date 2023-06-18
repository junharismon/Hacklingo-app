import mongoose from "../config/connectToMongoDB.js";
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    userId: {
      type: Schema.ObjectId,
      required: [true, "User Id is required"],
      ref: "User"
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      validate: {
        validator: (str) => {
          return str.length <= 120;
        },
        message: "Max title length is 120 characters"
      }
    },
    content: {
      type: String,
      required: [true, "Content is required"], 
    },
    postImageUrl: {
      type: String
    },
    forumId: {
      type: Schema.Types.ObjectId,
      required: [true, "Forum Id is required"],
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
