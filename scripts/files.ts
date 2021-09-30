import { watch } from 'chokidar';
import { createReadStream, ReadStream } from 'fs';
import { Logger } from './logger';

export const runFilesDetection = (
  path: string,
  cb: (eventName: 'add' | 'unlink', result: ReadStream) => void,
): void => {
  const watcher = watch(path, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles,
    persistent: true,
  });

  watcher.on('add', (path) => {
    Logger.log(`File ${path} has been added`);

    const stream = createReadStream(path);
    cb('add', stream);
  });
  // .on('unlink', (path) => {
  //   Logger.log(`File ${path} has been removed`);
  //   cb('unlink', null);
  // });
  // .on('change', (path) => {
  //   Logger.log(`File ${path} has been changed`);

  //   const fileContent = readFileSync(path, { encoding: 'base64' });
  //   resolve({ eventName: 'change', result: fileContent });
  // })
};
