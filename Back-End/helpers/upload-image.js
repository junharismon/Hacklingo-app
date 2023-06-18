import gc from "../config/connectToGoogleCloudStorage.js";
const bucket = gc.bucket("hacklingo_images"); // should be your bucket name

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadFile = (file) =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;
    const blob = bucket.file(originalname.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`; // I will change the blob.name to image._id from graphQL
        resolve(publicUrl);
      })
      .on("error", (err) => {
        reject(err);
      })
      .end(buffer);
  });

export default uploadFile;
