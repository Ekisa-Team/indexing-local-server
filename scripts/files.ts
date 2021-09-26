import { watch } from "chokidar";
import { readFile, readFileSync } from "fs";
import { Logger } from "./logger";

export const runFilesDetection = (path: string) => {
  const watcher = watch(path, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles,
    persistent: true,
  });

  watcher
    .on("add", (path) => {
      Logger.log(`File ${path} has been added`);

      const fileContent = readFileSync(path, { encoding: "base64" });
      console.log(fileContent);
    })
    .on("change", (path) => {
      Logger.log(`File ${path} has been changed`);

      readFile(path, (buffer) => {
        console.log(buffer);
      });
    })
    .on("unlink", (path) => {
      Logger.log(`File ${path} has been removed`);
    });
};
