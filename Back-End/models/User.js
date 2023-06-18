import mongoose from "../config/connectToMongoDB.js";
import { hashPassword } from "../helpers/bcrypt.js";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Email must be in email format"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      match: [/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/, "Password has to have at least 1 number and 1 capital letter, and minimum 6 characters"],
    },
    nativeLanguage: {
      type: String,
      required: [true, "Native language is required"],
      enum: {
        values: [
          "English",
          "German/Deutsch",
          "Japanese/日本語",
          "Indonesian/Bahasa Indonesia",
          "French/Français",
          "Spanish/Español",
          "Dutch/Nederlands",
          "Others",
        ],
        message: "Native language is not in any of the options",
      },
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["regular", "moderator"],
        message: "Role must be either 'regular' or 'moderator'",
      },
    },
    profileImageUrl: {
      type: String,
    },
    deviceToken: {
      type: String,
    },
    targetLanguage: [
      {
        type: String,
        enum: {
          values: [
            "English",
            "German/Deutsch",
            "Japanese/日本語",
            "Indonesian/Bahasa Indonesia",
            "French/Français",
            "Spanish/Español",
            "Dutch/Nederlands",
            "Others",
          ],
          message: "Target language is not in any of the options",
        },
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    articles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = hashPassword(this.password);
    next();
  } catch (err) {
  }
});

const User = mongoose.model("User", userSchema);

export default User;
