import mongoose from "../config/connectToMongoDB.js";
const { Schema } = mongoose;

const forumSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    flagImage : {
      type: String,
      required: true
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post"
      }
    ]
  },
  { timestamps: true }
);

const Forum = mongoose.model("Forum", forumSchema);

export default Forum;
