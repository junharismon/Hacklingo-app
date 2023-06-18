import Cloud from "@google-cloud/storage";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serviceKey = path.join(
  __dirname,
  "../hacklingo-images-key.json"
);

const { Storage } = Cloud;
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: "hacklingo-385822",
});

export default storage;
