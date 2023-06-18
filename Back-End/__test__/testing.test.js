// we import a function that we wrote to create a new instance of Apollo Server
import fs from "fs";
import app from "../app.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// we'll use supertest to test our server
import request from "supertest";
const newUserTestData = JSON.parse(
  fs.readFileSync("__test__/testData/userTestData.json", "utf-8")
);
const newForumTestData = JSON.parse(
  fs.readFileSync("__test__/testData/forumTestData.json", "utf-8")
);
const newPostTestData = JSON.parse(
  fs.readFileSync("__test__/testData/postTestData.json", "utf-8")
);
const newCommentTestData = JSON.parse(
  fs.readFileSync("__test__/testData/commentTestData.json", "utf-8")
);
const newArticlesTestData = JSON.parse(
  fs.readFileSync("__test__/testData/articleTestData.json", "utf-8")
);
import User from "../models/User.js";
import Post from "../models/Post";
import Forum from "../models/Forum.js";
import Comment from "../models/Comment.js";
import Article from "../models/Article.js";

let userId = "";
let forumId = "";
let postId = "";
let commentId = "";
let articleId = "";
let dummyUserId = "";
// before the tests we spin up a new Apollo Server
beforeAll(async () => {
  const newDummyUser = new User({
    username: "test dummy",
    email: "test_dummy@mail.com",
    password: "Test123",
    nativeLanguage: "Indonesian/Bahasa Indonesia",
    targetLanguage: ["Indonesian/Bahasa Indonesia", "English"],
    role: "regular",
  });
  await newDummyUser.save();
  dummyUserId = newDummyUser._id;
  const newDummyUser2 = new User({
    username: "test dummy 2",
    email: "test_dummy2@mail.com",
    password: "Test123",
    nativeLanguage: "German/Deutsch",
    targetLanguage: ["Indonesian/Bahasa Indonesia", "English"],
    role: "regular",
  });
  await newDummyUser2.save();
  const newDummyUser3 = new User({
    username: "test dummy3",
    email: "test_dummy3@mail.com",
    password: "Test123",
    nativeLanguage: "English",
    targetLanguage: ["Indonesian/Bahasa Indonesia", "English"],
    role: "regular",
  });
  await newDummyUser3.save();
});

// after the tests we'll stop the server
afterAll(async () => {
  await Forum.deleteMany();
  await User.deleteMany();
  await Post.deleteMany();
  await Comment.deleteMany();
  await Article.deleteMany();
});

describe("open server", () => {
  describe("success open", () => {
    it.only("should return message after success", async () => {
      const { body, status } = await request(app).get("/");
      const response = body;
      expect(status).toBe(200);
      expect(response).toHaveProperty("message");
      expect(response.message).toBe("Hello guys!!!");
    });
  });
});

describe("insert new forums", () => {
  describe("successful inserts", () => {
    it.only("should return inserted Ids after success", async () => {
      const { body, status } = await request(app)
        .post("/forums")
        .send(newForumTestData);
      const response = body;
      expect(status).toBe(201);
      expect(response).toHaveProperty("forums");
      expect(response).toHaveProperty("message");
      expect(response.forums).toHaveProperty("0");
      forumId = response.forums["0"].toString();
    });
  });

  describe("failed inserts", () => {
    it.only("should return error after failure due to duplicating names", async () => {
      const { body, status } = await request(app)
        .post("/forums")
        .send(newForumTestData);
      const response = body;
      expect(status).toBe(400);
      expect(response).toHaveProperty("message");
      expect(response.message).toBe("Forum name already exists");
    });
  });
});

describe("insert new User", () => {
  describe("successful inserts", () => {
    it.only("should return a new user after success", async () => {
      const { body, status } = await request(app)
        .post("/users/register")
        .field("username", newUserTestData[0].input.username)
        .field("email", newUserTestData[0].input.email)
        .field("password", newUserTestData[0].input.password)
        .field("nativeLanguage", newUserTestData[0].input.nativeLanguage)
        .field("targetLanguage", JSON.stringify(newUserTestData[0].input.targetLanguage))
        .field("role", newUserTestData[0].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
      const newUser = body;
      // console.log(newUser, "<<<< ini new user");
      userId = newUser._id;
      expect(status).toBe(201);
      expect(newUser).toHaveProperty("_id");
      expect(newUser).toHaveProperty("password");
      expect(newUser).toHaveProperty("email");
      expect(newUser).toHaveProperty("role");
      expect(newUser.role).toBe("regular");
    });

    it.only("should return a new user after success with image", async () => {
      const filePath = path.join(__dirname, "testImages/Borobudur_Temple.jpg");
      const { body, status } = await request(app)
        .post("/users/register")
        .field("username", newUserTestData[1].input.username)
        .field("email", newUserTestData[1].input.email)
        .field("password", newUserTestData[1].input.password)
        .field("nativeLanguage", newUserTestData[1].input.nativeLanguage)
        .field("targetLanguage", JSON.stringify(newUserTestData[1].input.targetLanguage))
        .field("role", newUserTestData[1].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
        .attach("file", filePath, "Borobudur_Temple.jpg");
      const newUser = body;
      expect(status).toBe(201);
      expect(newUser).toHaveProperty("_id");
      expect(newUser).toHaveProperty("password");
      expect(newUser).toHaveProperty("email");
      expect(newUser).toHaveProperty("profileImageUrl");
      expect(newUser).toHaveProperty("role");
      expect(newUser.profileImageUrl).toBe(
        "https://storage.googleapis.com/hacklingo_images/Borobudur_Temple.jpg"
      );
      expect(newUser.role).toBe("regular");
    });
  });

  describe("failed inserts", () => {
    it.only("should return error with input without email", async () => {
      const { body, status } = await request(app)
        .post("/users/register")
        .field("username", newUserTestData[2].input.username)
        .field("password", newUserTestData[2].input.password)
        .field("nativeLanguage", newUserTestData[2].input.nativeLanguage)
        .field("targetLanguage", JSON.stringify(newUserTestData[2].input.targetLanguage))
        .field("role", newUserTestData[2].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
      const newUser = body;
      expect(status).toBe(400);
      expect(newUser).toHaveProperty("message");
      expect(newUser.message).toBe("Email is required");
    });

    it.only("should return error with input without password", async () => {
      const { body, status } = await request(app)
        .post("/users/register")
        .field("email", newUserTestData[3].input.email)
        .field("username", newUserTestData[3].input.username)
        .field("nativeLanguage", newUserTestData[3].input.nativeLanguage)
        .field("targetLanguage", JSON.stringify(newUserTestData[3].input.targetLanguage))
        .field("role", newUserTestData[3].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
      const newUser = body;
      expect(status).toBe(400);
      expect(newUser).toHaveProperty("message");
      expect(newUser.message).toBe("Password is required");
    });

    it.only("should return error with input without proper role", async () => {
      const { body, status } = await request(app)
        .post("/users/register")
        .field("email", newUserTestData[4].input.email)
        .field("username", newUserTestData[4].input.username)
        .field("password", newUserTestData[4].input.password)
        .field("nativeLanguage", newUserTestData[4].input.nativeLanguage)
        .field("targetLanguage", JSON.stringify(newUserTestData[4].input.targetLanguage))
        .field("role", newUserTestData[4].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
      const newUser = body;
      expect(status).toBe(400);
      expect(newUser).toHaveProperty("message");
      expect(newUser.message).toBe(
        "Role must be either 'regular' or 'moderator'"
      );
    });

    it.only("should return error with input without proper native language", async () => {
      const { body, status } = await request(app)
        .post("/users/register")
        .field("email", newUserTestData[5].input.email)
        .field("username", newUserTestData[5].input.username)
        .field("password", newUserTestData[5].input.password)
        .field("nativeLanguage", newUserTestData[5].input.nativeLanguage)
        .field("targetLanguage", JSON.stringify(newUserTestData[5].input.targetLanguage))
        .field("role", newUserTestData[5].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
      const newUser = body;
      expect(status).toBe(400);
      expect(newUser).toHaveProperty("message");
      expect(newUser.message).toBe(
        "Native language is not in any of the options"
      );
    });

    it.only("should return error with duplicate input", async () => {
      const { body, status } = await request(app)
        .post("/users/register")
        .field("email", newUserTestData[6].input.email)
        .field("username", newUserTestData[6].input.username)
        .field("password", newUserTestData[6].input.password)
        .field("nativeLanguage", newUserTestData[6].input.nativeLanguage)
        .field("targetLanguage", JSON.stringify(newUserTestData[6].input.targetLanguage))
        .field("role", newUserTestData[6].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
      const newUser = body;
      expect(status).toBe(400);
      expect(newUser).toHaveProperty("message");
      expect(newUser.message).toBe("This username/email has been taken");
    });

    it.only("should return error with empty username", async () => {
      const { body, status } = await request(app)
        .post("/users/register")
        .field("email", newUserTestData[7].input.email)
        .field("username", newUserTestData[7].input.username)
        .field("password", newUserTestData[7].input.password)
        .field("nativeLanguage", newUserTestData[7].input.nativeLanguage)
        .field("targetLanguage", JSON.stringify(newUserTestData[7].input.targetLanguage))
        .field("role", newUserTestData[7].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
      const newUser = body;
      expect(status).toBe(400);
      expect(newUser).toHaveProperty("message");
      expect(newUser.message).toBe("Username is required");
    });

    it.only("should return error with empty email", async () => {
      const { body, status } = await request(app)
        .post("/users/register")
        .field("email", newUserTestData[8].input.email)
        .field("username", newUserTestData[8].input.username)
        .field("password", newUserTestData[8].input.password)
        .field("nativeLanguage", newUserTestData[8].input.nativeLanguage)
        .field("targetLanguage", JSON.stringify(newUserTestData[8].input.targetLanguage))
        .field("role", newUserTestData[8].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
      const newUser = body;
      expect(status).toBe(400);
      expect(newUser).toHaveProperty("message");
      expect(newUser.message).toBe("Email is required");
    });

    it.only("should return error with empty password", async () => {
      const { body, status } = await request(app)
        .post("/users/register")
        .field("email", newUserTestData[9].input.email)
        .field("username", newUserTestData[9].input.username)
        .field("password", newUserTestData[9].input.password)
        .field("nativeLanguage", newUserTestData[9].input.nativeLanguage)
        .field("targetLanguage", JSON.stringify(newUserTestData[9].input.targetLanguage))
        .field("role", newUserTestData[9].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
      const newUser = body;
      expect(status).toBe(400);
      expect(newUser).toHaveProperty("message");
      expect(newUser.message).toBe("Password is required");
    });

    it.only("should return error with password that didnt match regex", async () => {
      const { body, status } = await request(app)
        .post("/users/register")
        .field("email", newUserTestData[10].input.email)
        .field("username", newUserTestData[10].input.username)
        .field("password", newUserTestData[10].input.password)
        .field("nativeLanguage", newUserTestData[10].input.nativeLanguage)
        .field("targetLanguage", JSON.stringify(newUserTestData[10].input.targetLanguage))
        .field("role", newUserTestData[10].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
      const newUser = body;
      expect(status).toBe(400);
      expect(newUser).toHaveProperty("message");
      expect(newUser.message).toBe(
        "Password has to have at least 1 number and 1 capital letter, and minimum 6 characters"
      );
    });

    it.only("should return error with password that didnt match regex", async () => {
      const { body, status } = await request(app)
        .post("/users/register")
        .field("email", newUserTestData[11].input.email)
        .field("username", newUserTestData[11].input.username)
        .field("password", newUserTestData[11].input.password)
        .field("nativeLanguage", newUserTestData[11].input.nativeLanguage)
        .field("targetLanguage", JSON.stringify(newUserTestData[11].input.targetLanguage))
        .field("role", newUserTestData[11].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
      const newUser = body;
      expect(status).toBe(400);
      expect(newUser).toHaveProperty("message");
      expect(newUser.message).toBe(
        "Password has to have at least 1 number and 1 capital letter, and minimum 6 characters"
      );
    });

    it.only("should return error with password that didnt match regex", async () => {
      const { body, status } = await request(app)
        .post("/users/register")
        .field("email", newUserTestData[12].input.email)
        .field("username", newUserTestData[12].input.username)
        .field("password", newUserTestData[12].input.password)
        .field("nativeLanguage", newUserTestData[12].input.nativeLanguage)
        .field("targetLanguage", JSON.stringify(newUserTestData[12].input.targetLanguage))
        .field("role", newUserTestData[12].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
      const newUser = body;
      expect(status).toBe(400);
      expect(newUser).toHaveProperty("message");
      expect(newUser.message).toBe(
        "Password has to have at least 1 number and 1 capital letter, and minimum 6 characters"
      );
    });

    it.only("should return error with target language that doesn't pass array", async () => {
      const { body, status } = await request(app)
        .post("/users/register")
        .field("email", newUserTestData[13].input.email)
        .field("username", newUserTestData[13].input.username)
        .field("password", newUserTestData[13].input.password)
        .field("nativeLanguage", newUserTestData[13].input.nativeLanguage)
        .field("targetLanguage", JSON.stringify(newUserTestData[13].input.targetLanguage))
        .field("role", newUserTestData[13].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
      const newUser = body;
      expect(status).toBe(400);
      expect(newUser).toHaveProperty("message");
      expect(newUser.message).toBe(
        "Target language is not in any of the options"
      );
    });

    it.only("should return error when the upload is not an image", async () => {
      const filePath = path.join(__dirname, "testImages/test.txt");
      const { body, status } = await request(app)
        .post("/users/register")
        .field("username", newUserTestData[14].input.username)
        .field("email", newUserTestData[14].input.email)
        .field("password", newUserTestData[14].input.password)
        .field("nativeLanguage", newUserTestData[14].input.nativeLanguage)
        .field("targetLanguage", newUserTestData[14].input.targetLanguage)
        .field("role", newUserTestData[14].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
        .attach("file", filePath, "test.txt");
      const newUser = body;
      expect(status).toBe(400);
      expect(newUser).toHaveProperty("message");
      expect(newUser.message).toBe("You have invalid file");
    });

    it.only("should return error when the image size is too large", async () => {
      const filePath = path.join(__dirname, "testImages/test_too_large.jpg");
      const { body, status } = await request(app)
        .post("/users/register")
        .field("username", newUserTestData[14].input.username)
        .field("email", newUserTestData[14].input.email)
        .field("password", newUserTestData[14].input.password)
        .field("nativeLanguage", newUserTestData[14].input.nativeLanguage)
        .field("targetLanguage", newUserTestData[14].input.targetLanguage)
        .field("role", newUserTestData[14].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
        .attach("file", filePath, "test_too_large.jpg");
      const newUser = body;
      expect(status).toBe(400);
      expect(newUser).toHaveProperty("message");
      expect(newUser.message).toBe("File too large");
    });

    it.only("should return error with invalid email format", async () => {
      const { body, status } = await request(app)
        .post("/users/register")
        .field("email", newUserTestData[15].input.email)
        .field("username", newUserTestData[15].input.username)
        .field("password", newUserTestData[15].input.password)
        .field("nativeLanguage", newUserTestData[15].input.nativeLanguage)
        .field("targetLanguage", JSON.stringify(newUserTestData[15].input.targetLanguage))
        .field("role", newUserTestData[15].input.role)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
      const newUser = body;
      expect(status).toBe(400);
      expect(newUser).toHaveProperty("message");
      expect(newUser.message).toBe("Email must be in email format");
    });
  });
});

describe("login User", () => {
  describe("successfull login", () => {
    it.only("should return user data after login", async () => {
      const { body, status } = await request(app)
        .post("/users/login")
        .set("userid", userId)
        .send({
          email: newUserTestData[0].input.email,
          password: newUserTestData[0].input.password,
        });
      const user = body;
      expect(status).toBe(200);
      expect(user).toHaveProperty("_id");
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("role");
      expect(user.username).toBe("test");
    });
  });

  describe("failed logins", () => {
    it.only("should return error with wrong email", async () => {
      const { body, status } = await request(app)
        .post("/users/login")
        .set("userid", userId)
        .send({
          email: "afnafnafn@mail.com",
          password: newUserTestData[0].input.password,
        });
      const user = body;
      expect(status).toBe(401);
      expect(user).toHaveProperty("message");
      expect(user.message).toBe("Email/Password is incorrect");
    });

    it.only("should return error with wrong password", async () => {
      const { body, status } = await request(app)
        .post("/users/login")
        .set("userid", userId)
        .send({
          email: newUserTestData[0].input.password,
          password: "ajfflkjfklsjdafljslkfjl",
        });
      const user = body;
      expect(status).toBe(401);
      expect(user).toHaveProperty("message");
      expect(user.message).toBe("Email/Password is incorrect");
    });

    it.only("should return error with empty email", async () => {
      const { body, status } = await request(app)
        .post("/users/login")
        .set("userid", userId)
        .send({
          email: "",
          password: newUserTestData[0].input.password,
        });
      const user = body;
      expect(status).toBe(401);
      expect(user).toHaveProperty("message");
      expect(user.message).toBe("Email/Password is incorrect");
    });

    it.only("should return error with empty password", async () => {
      const { body, status } = await request(app)
        .post("/users/login")
        .set("userid", userId)
        .send({
          email: newUserTestData[0].input.email,
          password: "",
        });
      const user = body;
      expect(status).toBe(401);
      expect(user).toHaveProperty("message");
      expect(user.message).toBe("Email/Password is incorrect");
    });
  });
});

describe("insert new Article", () => {
  describe("successful inserts", () => {
    it.only("should return a new article after success", async () => {
      const { body, status } = await request(app)
        .post("/articles")
        .set("userid", userId)
        .send({ ...newArticlesTestData[0] });
      const newArticle = body;
      articleId = newArticle._id;
      expect(status).toBe(201);
      expect(newArticle).toHaveProperty("_id");
      expect(newArticle).toHaveProperty("title");
      expect(newArticle).toHaveProperty("content");
      expect(newArticle).toHaveProperty("userId");
      expect(newArticle.title).toBe("English is the best");
    });
  });

  describe("failed inserts", () => {
    it.only("should return an error with input without userId", async () => {
      const { body, status } = await request(app)
        .post("/articles")
        .send({ ...newArticlesTestData[1] });
      const newArticle = body;
      expect(status).toBe(401);
      expect(newArticle).toHaveProperty("message");
      expect(newArticle.message).toBe("You do not have access to this action");
    });

    it.only("should return an error with input with malformed userId", async () => {
      const { body, status } = await request(app)
        .post("/articles")
        .set("userid", "1235893758973485")
        .send({ ...newArticlesTestData[1] });
      const newArticle = body;
      expect(status).toBe(401);
      expect(newArticle).toHaveProperty("message");
      expect(newArticle.message).toBe("You do not have access to this action");
    });

    it.only("should return an error with input with invalid userId", async () => {
      const { body, status } = await request(app)
        .post("/articles")
        .set("userid", "123456789012345678901234")
        .send({ ...newArticlesTestData[1] });
      const newArticle = body;
      expect(status).toBe(401);
      expect(newArticle).toHaveProperty("message");
      expect(newArticle.message).toBe("You do not have access to this action");
    });

    it.only("should return an error with input with empty title", async () => {
      const { body, status } = await request(app)
        .post("/articles")
        .set("userid", userId)
        .send({ ...newArticlesTestData[2] });
      const newArticle = body;
      expect(status).toBe(400);
      expect(newArticle).toHaveProperty("message");
      expect(newArticle.message).toBe("Title is required");
    });

    it.only("should return an error with empty content", async () => {
      const { body, status } = await request(app)
        .post("/articles")
        .set("userid", userId)
        .send({ ...newArticlesTestData[3] });
      const newArticle = body;
      expect(status).toBe(400);
      expect(newArticle).toHaveProperty("message");
      expect(newArticle.message).toBe("Content is required");
    });
  });
});

describe("insert new Post", () => {
  // this is the query for our test

  describe("successful inserts", () => {
    it.only("should return a new post after success", async () => {
      const { body, status } = await request(app)
        .post("/posts")
        .set("userid", userId)
        .send({ ...newPostTestData[0].input, forumId });
      const newPost = body;
      postId = newPost._id;
      expect(status).toBe(201);
      expect(newPost).toHaveProperty("_id");
      expect(newPost).toHaveProperty("title");
      expect(newPost).toHaveProperty("content");
      expect(newPost).toHaveProperty("userId");
      expect(newPost).toHaveProperty("forumId");
      expect(newPost.title).toBe("null");
    });

    it.only("should return a new post after success with image", async () => {
      const filePath = path.join(__dirname, "testImages/Borobudur_Temple.jpg");
      const { body, status } = await request(app)
        .post("/posts")
        .field("title", newPostTestData[1].input.title)
        .field("content", newPostTestData[1].input.content)
        .field("forumId", forumId)
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
        .set("userid", userId)
        .attach("file", filePath, "Borobudur_Temple.jpg");
      const newPost = body;
      expect(status).toBe(201);
      expect(newPost).toHaveProperty("postImageUrl");
      expect(newPost.postImageUrl).toBe(
        "https://storage.googleapis.com/hacklingo_images/Borobudur_Temple.jpg"
      );
    });
  });

  describe("failed inserts", () => {
    it.only("should return an error with input without userId", async () => {
      const { body, status } = await request(app)
        .post("/posts")
        .send({ ...newPostTestData[2].input, forumId });
      const newPost = body;
      expect(status).toBe(401);
      expect(newPost).toHaveProperty("message");
      expect(newPost.message).toBe("You do not have access to this action");
    });

    it.only("should return an error with input without forumId", async () => {
      const { body, status } = await request(app)
        .post("/posts")
        .set("userid", userId)
        .send({ ...newPostTestData[3].input });
      const newPost = body;
      expect(status).toBe(400);
      expect(newPost).toHaveProperty("message");
      expect(newPost.message).toBe("Forum Id is required");
    });

    it.only("should return an error with input without title", async () => {
      const { body, status } = await request(app)
        .post("/posts")
        .set("userid", userId)
        .send({ ...newPostTestData[4].input, forumId });
      const newPost = body;
      expect(status).toBe(400);
      expect(newPost).toHaveProperty("message");
      expect(newPost.message).toBe("Title is required");
    });

    it.only("should return an error with input without content", async () => {
      const { body, status } = await request(app)
        .post("/posts")
        .set("userid", userId)
        .send({ ...newPostTestData[5].input, userId, forumId });
      const newPost = body;
      expect(status).toBe(400);
      expect(newPost).toHaveProperty("message");
      expect(newPost.message).toBe("Content is required");
    });

    it.only("should return an error with input title above 120 characters", async () => {
      const { body, status } = await request(app)
        .post("/posts")
        .set("userid", userId)
        .send({ ...newPostTestData[6].input, userId, forumId });
      const newPost = body;
      expect(status).toBe(400);
      expect(newPost).toHaveProperty("message");
      expect(newPost.message).toBe("Max title length is 120 characters");
    });
  });
});

describe("insert new Comment", () => {
  describe("successful inserts", () => {
    it.only("should return a new comment after success", async () => {
      const { body, status } = await request(app)
        .post("/comments")
        .set("userid", userId)
        .send({ ...newCommentTestData[0].input, postId });
      const newComment = body;
      commentId = newComment._id;
      expect(status).toBe(201);
      expect(newComment).toHaveProperty("_id");
      expect(newComment).toHaveProperty("content");
      expect(newComment).toHaveProperty("userId");
      expect(newComment).toHaveProperty("postId");
      expect(newComment.content).toBe("balesan lorem ipsum solor der amet");
    });
  });

  describe("failed inserts", () => {
    it.only("should return an error with input without userId", async () => {
      const { body, status } = await request(app)
        .post("/comments")
        .send({ ...newCommentTestData[1].input, postId });
      const newComment = body;
      expect(status).toBe(401);
      expect(newComment).toHaveProperty("message");
      expect(newComment.message).toBe("You do not have access to this action");
    });

    it.only("should return an error with input without postId", async () => {
      const { body, status } = await request(app)
        .post("/comments")
        .set("userid", userId)
        .send({ ...newCommentTestData[2].input });
      const newComment = body;
      expect(status).toBe(400);
      expect(newComment).toHaveProperty("message");
      expect(newComment.message).toBe("Post Id is required");
    });

    it.only("should return an error with input without content", async () => {
      const { body, status } = await request(app)
        .post("/comments")
        .set("userid", userId)
        .send({ ...newCommentTestData[3].input, postId });
      const newComment = body;
      expect(status).toBe(400);
      expect(newComment).toHaveProperty("message");
      expect(newComment.message).toBe("Content is required");
    });

    it.only("should return an error with empty content", async () => {
      const { body, status } = await request(app)
        .post("/comments")
        .set("userid", userId)
        .send({ ...newCommentTestData[4].input, postId });
      const newComment = body;
      expect(status).toBe(400);
      expect(newComment).toHaveProperty("message");
      expect(newComment.message).toBe("Content is required");
    });
  });
});

describe("update User by Id", () => {
  // this is the query for our test

  describe("successful update", () => {
    it.only("should return the updated user after success with image", async () => {
      const filePath = path.join(__dirname, "testImages/Stupa_Borobudur.jpg");
      const { body, status } = await request(app)
        .put(`/users/${userId}`)
        .field("username", "test edit")
        .field("nativeLanguage", "German/Deutsch")
        .field("targetLanguage", ["English", "German/Deutsch"])
        .field("context", "image")
        .set("Content-Type", "multipart/form-data")
        .set("userid", userId)
        .attach("file", filePath, "Stupa_Borobudur.jpg");
      const updatedUser = body;
      expect(status).toBe(200);
      expect(updatedUser).toHaveProperty("_id");
      expect(updatedUser).toHaveProperty("username");
      expect(updatedUser).toHaveProperty("profileImageUrl");
      expect(updatedUser).toHaveProperty("email");
      expect(updatedUser.username).toBe("test edit");
      expect(updatedUser.profileImageUrl).toBe(
        "https://storage.googleapis.com/hacklingo_images/Stupa_Borobudur.jpg"
      );
    });
  });

  describe("failed updates", () => {
    it.only("should return error with input with malformed userId params", async () => {
      const updateInput = {
        ...newUserTestData[0].input,
        username: "",
        password: "Test123Edit",
        nativeLanguage: "Indonesian/Bahasa Indonesia",
        targetLanguage: ["German/Deutsch", "English"],
      };
      const { body, status } = await request(app)
        .put(`/users/123456789012345678901234`)
        .set("userid", userId)
        .send(updateInput);
      const updatedUser = body;
      expect(status).toBe(404);
      expect(updatedUser).toHaveProperty("message");
      expect(updatedUser.message).toBe("Data not found");
    });

    it.only("should return error with input without username", async () => {
      const updateInput = {
        ...newUserTestData[0].input,
        username: "",
        password: "Test123Edit",
        nativeLanguage: "Indonesian/Bahasa Indonesia",
        targetLanguage: ["German/Deutsch", "English"],
      };
      const { body, status } = await request(app)
        .put(`/users/${userId}`)
        .set("userid", userId)
        .send(updateInput);
      const updatedUser = body;
      expect(status).toBe(400);
      expect(updatedUser).toHaveProperty("message");
      expect(updatedUser.message).toBe("Username is required");
    });

    it.only("should return error with input without password", async () => {
      const updateInput = {
        ...newUserTestData[0].input,
        username: "test edit",
        password: "",
        nativeLanguage: "Indonesian/Bahasa Indonesia",
        targetLanguage: ["German/Deutsch", "English"],
      };
      const { body, status } = await request(app)
        .put(`/users/${userId}`)
        .set("userid", userId)
        .send(updateInput);
      const updatedUser = body;
      expect(status).toBe(400);
      expect(updatedUser).toHaveProperty("message");
      expect(updatedUser.message).toBe("Password is required");
    });

    it.only("should return error with input without nativeLanguage", async () => {
      const updateInput = {
        ...newUserTestData[0].input,
        username: "test edit",
        password: "TestEdit123",
        nativeLanguage: "",
        targetLanguage: ["German/Deutsch", "English"],
      };
      const { body, status } = await request(app)
        .put(`/users/${userId}`)
        .set("userid", userId)
        .send(updateInput);
      const updatedUser = body;
      expect(status).toBe(400);
      expect(updatedUser).toHaveProperty("message");
      expect(updatedUser.message).toBe("Native language is required");
    });

    it.only("should return error with input with improper nativeLanguage", async () => {
      const updateInput = {
        ...newUserTestData[0].input,
        username: "test edit",
        password: "TestEdit123",
        nativeLanguage: "kjlksajfkslf",
        targetLanguage: ["German/Deutsch", "English"],
      };
      const { body, status } = await request(app)
        .put(`/users/${userId}`)
        .set("userid", userId)
        .send(updateInput);
      const updatedUser = body;
      expect(status).toBe(400);
      expect(updatedUser).toHaveProperty("message");
      expect(updatedUser.message).toBe(
        "Native language is not in any of the options"
      );
    });

    it.only("should return error with input with improper targetLanguage", async () => {
      const updateInput = {
        ...newUserTestData[0].input,
        username: "test edit",
        password: "TestEdit123",
        nativeLanguage: "English",
        targetLanguage: ["German/Deutsch", "fjlksjflkjsflkj"],
      };
      const { body, status } = await request(app)
        .put(`/users/${userId}`)
        .set("userid", userId)
        .send(updateInput);
      const updatedUser = body;
      expect(status).toBe(400);
      expect(updatedUser).toHaveProperty("message");
      expect(updatedUser.message).toBe(
        "Target language is not in any of the options"
      );
    });

    it.only("should return error with input with invalid current user", async () => {
      const updateInput = {
        ...newUserTestData[0].input,
        username: "test edit",
        password: "TestEdit123",
        nativeLanguage: "English",
        targetLanguage: ["German/Deutsch", "English"],
      };
      const { body, status } = await request(app)
        .put(`/users/${userId}`)
        .set("userid", dummyUserId)
        .send(updateInput);
      const updatedUser = body;
      expect(status).toBe(403);
      expect(updatedUser).toHaveProperty("message");
      expect(updatedUser.message).toBe(
        "You are forbidden from doing this action"
      );
    });

    it.only("should return error with invalid image type", async () => {
      const filePath = path.join(__dirname, "testImages/test.txt");
      const { body, status } = await request(app)
        .put(`/users/${userId}`)
        .field("username", "test edit")
        .field("nativeLanguage", "German/Deutsch")
        .field("targetLanguage", ["English", "German/Deutsch"])
        .field("context", "audio")
        .set("Content-Type", "multipart/form-data")
        .set("userid", userId)
        .attach("file", filePath, "Stupa_Borobudur.jpg");
      const updatedUser = body;
      expect(status).toBe(400);
      expect(updatedUser).toHaveProperty("message");
      expect(updatedUser.message).toBe("You have invalid file");
    });

    it.only("should return error with invalid upload context", async () => {
      const filePath = path.join(__dirname, "testImages/Stupa_Borobudur.jpg");
      const { body, status } = await request(app)
        .put(`/users/${userId}`)
        .field("username", "test edit")
        .field("nativeLanguage", "German/Deutsch")
        .field("targetLanguage", ["English", "German/Deutsch"])
        .set("Content-Type", "multipart/form-data")
        .set("userid", userId)
        .attach("file", filePath, "Stupa_Borobudur.jpg");
      const updatedUser = body;
      expect(status).toBe(400);
      expect(updatedUser).toHaveProperty("message");
      expect(updatedUser.message).toBe("You have invalid file");
    });
  });
});

describe("update Post by Id", () => {
  describe("successful update", () => {
    it.only("should return the updated post after success", async () => {
      const updateInput = {
        ...newPostTestData[0].input,
        content: "lorem ipsum edit",
      };
      const { body, status } = await request(app)
        .put(`/posts/${postId}`)
        .set("userid", userId)
        .send(updateInput);
      const updatedComment = body;
      expect(status).toBe(200);
      expect(updatedComment).toHaveProperty("_id");
      expect(updatedComment).toHaveProperty("content");
      expect(updatedComment.content).toBe("lorem ipsum edit");
    });
  });

  describe("failed updates", () => {
    it.only("should return error with empty content", async () => {
      const updateInput = {
        ...newPostTestData[0].input,
        content: "",
      };
      const { body, status } = await request(app)
        .put(`/posts/${postId}`)
        .set("userid", userId)
        .send(updateInput);
      const updaedPost = body;
      expect(status).toBe(400);
      expect(updaedPost).toHaveProperty("message");
      expect(updaedPost.message).toBe("Content is required");
    });

    it.only("should return error with input with invalid current user", async () => {
      const updateInput = {
        ...newUserTestData[0].input,
        content: "lorem ipsum edit 2",
      };
      const { body, status } = await request(app)
        .put(`/posts/${postId}`)
        .set("userid", dummyUserId)
        .send(updateInput);
      const updatedPost = body;
      expect(status).toBe(403);
      expect(updatedPost).toHaveProperty("message");
      expect(updatedPost.message).toBe(
        "You are forbidden from doing this action"
      );
    });
  });
});

describe("update Comment by Id", () => {
  describe("successful update", () => {
    it.only("should return the updated comment after success", async () => {
      const updateInput = {
        ...newCommentTestData[0].input,
        forumId,
        content: "lorem ipsum edit",
      };
      const { body, status } = await request(app)
        .put(`/comments/${commentId}`)
        .set("userid", userId)
        .send(updateInput);
      const updatedComment = body;
      expect(status).toBe(200);
      expect(updatedComment).toHaveProperty("_id");
      expect(updatedComment).toHaveProperty("content");
      expect(updatedComment.content).toBe("lorem ipsum edit");
    });
  });

  describe("failed updates", () => {
    it.only("should return error with empty content", async () => {
      const updateInput = {
        ...newCommentTestData[0].input,
        forumId,
        content: "",
      };
      const { body, status } = await request(app)
        .put(`/comments/${commentId}`)
        .set("userid", userId)
        .send(updateInput);
      const updatedComment = body;
      expect(status).toBe(400);
      expect(updatedComment).toHaveProperty("message");
      expect(updatedComment.message).toBe("Content is required");
    });
  });
});

describe("find Users based on their native language", () => {
  describe("successful fetch", () => {
    it.only("should return array of users after success", async () => {
      const targetLanguage = ["Indonesian/Bahasa Indonesia", "English"];
      const { body, status } = await request(app)
        .get(`/users`)
        .query({ targetLanguage })
        .set("userid", userId);
      const users = body;
      console.log(users, "<<<< ini users hasil find users by native language");
      expect(status).toBe(200);
      expect(users).toHaveLength(2);
      expect(users[0]).toHaveProperty("_id");
      expect(users[0]).toHaveProperty("username");
      expect(users[0]).toHaveProperty("email");
      expect(users[0].nativeLanguage).toMatch("Indonesian/Bahasa Indonesia");
    });

    it.only("should return array of users after success", async () => {
      const search = "dummy";
      const { body, status } = await request(app)
        .get(`/users/usernames`)
        .query({ search })
        .set("userid", userId);
      const users = body;
      expect(status).toBe(200);
      expect(users).toHaveLength(3);
      expect(users[0]).toHaveProperty("_id");
      expect(users[0]).toHaveProperty("username");
      expect(users[0]).toHaveProperty("email");
      expect(users[0].username).toMatch(/dummy/);
    });
  });

  describe("zero fetch", () => {
    it.only("should return error with empty content", async () => {
      const targetLanguage = ["Japanase/日本語"];
      const { body, status } = await request(app)
        .get(`/users`)
        .query({ targetLanguage })
        .set("userid", userId);
      const users = body;
      expect(status).toBe(200);
      expect(typeof users).toBe("object");
      expect(users).toHaveLength(0);
    });
  });
});

describe("find User based on their id", () => {
  describe("successful fetch", () => {
    it.only("should return array of users after success", async () => {
      const { body, status } = await request(app)
        .get(`/users/${userId}`)
        .set("userid", userId);
      const user = body;
      expect(status).toBe(200);
      expect(typeof user).toBe("object");
      expect(user).toHaveProperty("_id");
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("comments");
      expect(user).toHaveProperty("posts");
      expect(user.posts).toHaveLength(2);
      expect(user.posts[0]).toHaveProperty("content");
      expect(user.comments).toHaveLength(1);
      expect(user.comments[0]).toHaveProperty("content");
    });
  });

  describe("fetch with nonexistant id", () => {
    it.only("should return array of users after success", async () => {
      const { body, status } = await request(app)
        .get(`/users/kuashfkahfhsf`)
        .set("userid", userId);
      const user = body;
      expect(status).toBe(404);
      expect(user).toHaveProperty("message");
      expect(user.message).toBe("Data not found");
    });

    it.only("should return array of users after success", async () => {
      const { body, status } = await request(app)
        .get(`/users/123456789012345678901234`)
        .set("userid", userId);
      const user = body;
      expect(status).toBe(404);
      expect(user).toHaveProperty("message");
      expect(user.message).toBe("Data not found");
    });
  });
});

describe("find Post based on their id", () => {
  describe("successful fetch", () => {
    it.only("should return post after success", async () => {
      const { body, status } = await request(app)
        .get(`/posts/${postId}`)
        .set("userid", userId);
      const post = body;
      expect(status).toBe(200);
      expect(typeof post).toBe("object");
      expect(post).toHaveProperty("_id");
      expect(post).toHaveProperty("content");
      expect(post).toHaveProperty("forumId");
      expect(post).toHaveProperty("userId");
      expect(post).toHaveProperty("comments");
      expect(post.comments).toHaveLength(1);
      expect(post.comments[0]).toHaveProperty("content");
      expect(post._id).toBe(postId);
    });
  });

  describe("fetch with nonexistant id", () => {
    it.only("should return error with wrong id", async () => {
      const { body, status } = await request(app)
        .get(`/posts/jakfjslkfkljfsjfljfs`)
        .set("userid", userId);
      const post = body;
      expect(status).toBe(404);
      expect(post).toHaveProperty("message");
      expect(post.message).toBe("Data not found");
    });

    it.only("should return error with wrong id", async () => {
      const { body, status } = await request(app)
        .get(`/posts/123456789012345678901234`)
        .set("userid", userId);
      const post = body;
      expect(status).toBe(404);
      expect(post).toHaveProperty("message");
      expect(post.message).toBe("Data not found");
    });
  });
});

describe("find Post based on title and forumId", () => {
  describe("successful fetch", () => {
    it.only("should return posts after success", async () => {
      const search = "nu";
      const { body, status } = await request(app)
        .get(`/posts`)
        .query({ forumId, search })
        .set("userid", userId);
      const posts = body;
      expect(status).toBe(200);
      expect(posts).toHaveLength(2);
      expect(posts[0].title).toMatch(/nu/);
    });
  });

  describe("zero fetch", () => {
    it.only("should return error with random search", async () => {
      const search = "hfhsfhsahflsfl";
      const { body, status } = await request(app)
        .get(`/posts`)
        .query({ search })
        .set("userid", userId);
      const articles = body;
      expect(status).toBe(200);
      expect(articles).toHaveLength(0);
    });
  });
});

describe("find Comment based on their id", () => {
  describe("successful fetch", () => {
    it.only("should return comment after success", async () => {
      const { body, status } = await request(app)
        .get(`/comments/${commentId}`)
        .set("userid", userId);
      const comment = body;
      expect(status).toBe(200);
      expect(typeof comment).toBe("object");
      expect(comment).toHaveProperty("_id");
      expect(comment).toHaveProperty("content");
      expect(comment).toHaveProperty("postId");
      expect(comment).toHaveProperty("userId");
      expect(comment._id).toBe(commentId);
    });
  });

  describe("fetch with nonexistant id", () => {
    it.only("should return error with malformed id", async () => {
      const { body, status } = await request(app)
        .get(`/comments/14812904809248dvsd`)
        .set("userid", userId);
      const comment = body;
      expect(status).toBe(404);
      expect(comment).toHaveProperty("message");
      expect(comment.message).toBe("Data not found");
    });

    it.only("should return error with nonexistant id", async () => {
      const { body, status } = await request(app)
        .get(`/comments/123456789012345678901234`)
        .set("userid", userId);
      const comment = body;
      expect(status).toBe(404);
      expect(comment).toHaveProperty("message");
      expect(comment.message).toBe("Data not found");
    });
  });
});

describe("find Article based on their id", () => {
  describe("successful fetch", () => {
    it.only("should return article after success", async () => {
      const { body, status } = await request(app)
        .get(`/articles/${articleId}`)
        .set("userid", userId);
      const article = body;
      expect(status).toBe(200);
      expect(typeof article).toBe("object");
      expect(article).toHaveProperty("_id");
      expect(article).toHaveProperty("content");
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("userId");
      expect(article.title).toBe("English is the best");
    });
  });

  describe("fetch with nonexistant id", () => {
    it.only("should return error with wrong id", async () => {
      const { body, status } = await request(app)
        .get(`/articles/jakfjslkfkljfsjfljfs`)
        .set("userid", userId);
      const post = body;
      expect(status).toBe(404);
      expect(post).toHaveProperty("message");
      expect(post.message).toBe("Data not found");
    });

    it.only("should return error with wrong id", async () => {
      const { body, status } = await request(app)
        .get(`/articles/123456789012345678901234`)
        .set("userid", userId);
      const post = body;
      expect(status).toBe(404);
      expect(post).toHaveProperty("message");
      expect(post.message).toBe("Data not found");
    });
  });
});

describe("find Article based on title", () => {
  describe("successful fetch", () => {
    it.only("should return articles after success", async () => {
      const search = "English";
      const { body, status } = await request(app)
        .get(`/articles`)
        .query({ search })
        .set("userid", userId);
      const articles = body;
      expect(status).toBe(200);
      expect(articles).toHaveLength(1);
      expect(articles[0].title).toMatch(/English/);
    });
  });

  describe("zero fetch", () => {
    it.only("should return error with random search", async () => {
      const search = "hfhsfhsahflsfl";
      const { body, status } = await request(app)
        .get(`/articles`)
        .query({ search })
        .set("userid", userId);
      const articles = body;
      expect(status).toBe(200);
      expect(articles).toHaveLength(0);
    });
  });
});

describe("find All Forums", () => {
  describe("successful fetch", () => {
    it.only("should return array of forums after success", async () => {
      const { body, status } = await request(app)
        .get(`/forums`)
        .set("userid", userId);
      const forums = body;
      expect(status).toBe(200);
      expect(typeof forums).toBe("object");
      expect(forums).toHaveLength(7);
      expect(forums[0]).toHaveProperty("_id");
      expect(forums[0]).toHaveProperty("name");
      expect(forums[0].name).toBe("Dutch/Nederlands");
    });
  });
});

describe("find Forum By Id", () => {
  describe("successful fetch", () => {
    it.only("should return array of forums after success", async () => {
      const { body, status } = await request(app)
        .get(`/forums/${forumId}`)
        .set("userid", userId);
      const forum = body;
      expect(typeof forum).toBe("object");
      expect(forum).toHaveProperty("_id");
      expect(forum).toHaveProperty("name");
      expect(forum).toHaveProperty("posts");
      expect(forum.posts).toHaveLength(2);
      expect(forum.posts[0]).toHaveProperty("_id");
      expect(forum.posts[0]).toHaveProperty("content");
    });
  });

  describe("fetch with nonexistant id", () => {
    it.only("should return error with nonexistatnt id", async () => {
      const { body, status } = await request(app)
        .get(`/forums/kljflsjfjsfjsdfl`)
        .set("userid", userId);
      const forum = body;
      expect(status).toBe(404);
      expect(forum).toHaveProperty("message");
      expect(forum.message).toBe("Data not found");
    });

    it.only("should return error with nonexistatnt id", async () => {
      const { body, status } = await request(app)
        .get(`/forums/123456789012345678901234`)
        .set("userid", userId);
      const forum = body;
      expect(status).toBe(404);
      expect(forum).toHaveProperty("message");
      expect(forum.message).toBe("Data not found");
    });
  });
});

describe("delete Comment by Id", () => {
  describe("successful delete", () => {
    it.only("should return a response message on success", async () => {
      const { body, status } = await request(app)
        .delete(`/comments/${commentId}`)
        .set("userid", userId);
      const deletedComment = body;
      expect(status).toBe(200);
      expect(typeof deletedComment).toBe("object");
      expect(deletedComment).toHaveProperty("message");
      expect(deletedComment.message).toBe(
        `Comment with id ${commentId} has been deleted`
      );
    });
  });

  describe("failed delete", () => {
    it.only("should return an error message on nonexistatnt id", async () => {
      const { body, status } = await request(app)
        .delete(`/comments/lkjfskjfsjfjsa`)
        .set("userid", userId);
      const deletedComment = body;
      expect(status).toBe(404);
      expect(deletedComment).toHaveProperty("message");
      expect(deletedComment.message).toBe("Data not found");
    });

    it.only("should return an error message on malformed id", async () => {
      const { body, status } = await request(app)
        .delete(`/comments/123456789012345678901234`)
        .set("userid", userId);
      const deletedComment = body;
      expect(status).toBe(404);
      expect(deletedComment).toHaveProperty("message");
      expect(deletedComment.message).toBe("Data not found");
    });
  });
});

describe("delete Post by Id", () => {
  describe("successful delete", () => {
    it.only("should return a response message on success", async () => {
      const { body, status } = await request(app)
        .delete(`/posts/${postId}`)
        .set("userid", userId);
      const deletedPost = body;
      expect(status).toBe(200);
      expect(typeof deletedPost).toBe("object");
      expect(deletedPost).toHaveProperty("message");
      expect(deletedPost.message).toBe(
        `Post with id ${postId} has been deleted`
      );
    });
  });

  describe("failed delete", () => {
    it.only("should return an error message on nonexistatnt id", async () => {
      const { body, status } = await request(app)
        .delete(`/posts/lkjfskjfsjfjsa`)
        .set("userid", userId);
      const deletedPost = body;
      expect(status).toBe(404);
      expect(deletedPost).toHaveProperty("message");
      expect(deletedPost.message).toBe("Data not found");
    });
  });
});

describe("delete User by Id", () => {
  describe("successful delete", () => {
    it.only("should return a response message on success", async () => {
      const { body, status } = await request(app)
        .delete(`/users/${userId}`)
        .set("userid", userId);
      const deletedUser = body;
      expect(status).toBe(200);
      expect(typeof deletedUser).toBe("object");
      expect(deletedUser).toHaveProperty("message");
      expect(deletedUser.message).toBe(
        `User with id ${userId} has been deleted`
      );
    });
  });

  describe("failed delete", () => {
    it.only("should return an error message on nonexistatnt id", async () => {
      const { body, status } = await request(app)
        .delete(`/users/lkjfskjfsjfjsa`)
        .set("userid", dummyUserId);
      const deletedUser = body;
      expect(status).toBe(404);
      expect(deletedUser).toHaveProperty("message");
      expect(deletedUser.message).toBe("Data not found");
    });
  });
});

describe("delete Forum by Id", () => {
  describe("successful delete", () => {
    it.only("should return a response message on success", async () => {
      const { body, status } = await request(app)
        .delete(`/forums/${forumId}`)
        .set("userid", dummyUserId);
      const deletedForum = body;
      expect(status).toBe(200);
      expect(typeof deletedForum).toBe("object");
      expect(deletedForum).toHaveProperty("message");
      expect(deletedForum.message).toBe(
        `Forum with id ${forumId} has been deleted`
      );
    });
  });

  describe("failed delete", () => {
    it.only("should return an error message on nonexistatnt id", async () => {
      const { body, status } = await request(app)
        .delete(`/forums/asmlkasfkaSKAD`)
        .set("userid", dummyUserId);
      const deletedForum = body;
      expect(status).toBe(404);
      expect(typeof deletedForum).toBe("object");
      expect(deletedForum).toHaveProperty("message");
      expect(deletedForum.message).toBe("Data not found");
    });

    it.only("should return an error message on nonexistatnt id", async () => {
      const { body, status } = await request(app)
        .delete(`/forums/123456789012345678901234`)
        .set("userid", dummyUserId);
      const deletedForum = body;
      expect(status).toBe(404);
      expect(typeof deletedForum).toBe("object");
      expect(deletedForum).toHaveProperty("message");
      expect(deletedForum.message).toBe("Data not found");
    });
  });
});
