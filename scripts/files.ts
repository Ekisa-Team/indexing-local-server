import { watch } from 'chokidar';
import { readFileSync } from 'fs';
import { Logger } from './logger';

export const runFilesDetection = (
  path: string,
): Promise<{ eventName: 'add' | 'change' | 'unlink'; result: string }> => {
  return new Promise((resolve, reject) => {
    const watcher = watch(path, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles,
      persistent: true,
    });

    watcher
      .on('add', (path) => {
        Logger.log(`File ${path} has been added`);

        const fileContent = readFileSync(path, { encoding: 'base64' });
        resolve({ eventName: 'add', result: fileContent });
      })
      .on('change', (path) => {
        Logger.log(`File ${path} has been changed`);

        const fileContent = readFileSync(path, { encoding: 'base64' });
        resolve({ eventName: 'change', result: fileContent });
      })
      .on('unlink', (path) => {
        Logger.log(`File ${path} has been removed`);

        resolve({ eventName: 'unlink', result: path });
      });
  });
};
