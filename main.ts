import { config } from 'dotenv';
import express from 'express';
import downloadsFolder from 'downloads-folder';
import { runFilesDetection } from './scripts/files';
import { Api } from './scripts/api';

// config env variables
config();

// create express app
const app = express();
app.get('/', (req, res) => res.send('Indexing local server'));

// run file changing detection
const downloadsPath = downloadsFolder();
runFilesDetection(`${downloadsPath}/${process.env.INDEX_FOLDER}`, (eventName, result) => {
  // console.log({ eventName, result });
  if (eventName === 'add') {
    const UPLOAD_FILE_ENDPOINT = process.env.UPLOAD_FILE_ENDPOINT || '';
    const CLIENT_ID = process.env.CLIENT_ID || 1;
    Api.uploadToAzure(UPLOAD_FILE_ENDPOINT, Number(CLIENT_ID), result);
  }
});

// init server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));
