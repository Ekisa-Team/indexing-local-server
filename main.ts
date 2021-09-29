import { config } from 'dotenv';
import express from 'express';
import { getDownloadsFolder } from 'platform-folders';
import { runFilesDetection } from './scripts/files';

// config env variables
config();

// create express app
const app = express();
app.get('/', (req, res) => res.send('Indexing local server'));

// run file changing detection
const downloadsPath = getDownloadsFolder();
runFilesDetection(downloadsPath);

// init server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));
