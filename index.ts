import fs from "fs";
import dotenv from "dotenv";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import SearchTree from "./Search.js";
dotenv.config();
console.time("build");
const searchTree = new SearchTree();
const articleList = fs
  .readFileSync(process.cwd() + "/miloni.txt", "utf8")
  .split("\r\n");

articleList.forEach((article) => searchTree.add(article));

console.timeEnd("build");
const app = express();
const router = express.Router();

app.use(express.urlencoded({ extended: true }));

router.get("/search", (req, res) => {
  const { words = "" } = req.query;
  const stringifiedWords = `${words}`.split("|");
  const existingWords: string[] = [];
  for (const word of stringifiedWords) {
    if (word == null) continue;
    if (searchTree.has(word)) {
      existingWords.push(word);
    }
  }
  res.status(200).json({ success: true, existing: existingWords });
});
router.get("/update", (req, res) => {
  const { words = "" } = req.query;
  const stringifiedWords = `${words}`.split("|");
  stringifiedWords.forEach((word) => word != null && searchTree.add(word));
  res.status(201).json({ success: true, updated: stringifiedWords });
});
router.get("/delete", (req, res) => {
  const { words = "" } = req.query;
  const stringifiedWords = `${words}`.split("|");
  stringifiedWords.forEach((word) => word != null && searchTree.remove(word));
  res.status(201).json({ success: true, deleted: stringifiedWords });
});
router.all("*", (req, res) => {
  throw new Error("not allowed");
});
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.message !== "not allowed") {
    console.log(err);
  }
  res.status(400).json({ success: false, message: "not allowed" });
});
app.use(router);
app.listen(process.env.PORT || 3000, () => {
  console.log(
    `the search trie was build out from length of ${
      articleList.length
    } articles\nthe server is now listening on ${process.env.PORT || 3000}`
  );
});
