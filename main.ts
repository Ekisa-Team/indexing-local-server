import express from "express";
import { getDownloadsFolder } from "platform-folders";
import { runFilesDetection } from "./scripts/files";

const app = express();

app.get("/", (req, res) => res.send("Indexing local server"));

const downloadsPath = getDownloadsFolder();
runFilesDetection(downloadsPath);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);
