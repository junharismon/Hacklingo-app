import mongoose from "mongoose";

main().catch((err) => console.log(err));

async function main() {
  let url;

  if (process.env.NODE_ENV === "production") {
    url =
      process.env.DATABASE_URI;
  } else if (process.env.NODE_ENV === "test") {
    url = "mongodb://127.0.0.1:27017/HacklingoDBTest";
  } else {
    url = "mongodb://127.0.0.1:27017/HacklingoDB";
  }

  console.log(url, "<<< ini url mongoDB");

  await mongoose.connect(url);
}

export default mongoose;
