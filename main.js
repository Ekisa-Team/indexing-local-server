const axios = require('axios');
const chokidar = require('chokidar');
const dotenv = require('dotenv');
const DonwloadsFolder = require('downloads-folder');
const express = require('express');
const FormData = require('form-data');
const fs = require('fs');

// config env variables
dotenv.config();

// config logger
const log = console.log.bind(console);
const error = console.error.bind(console);
const info = console.info.bind(console);
const warn = console.warn.bind(console);

// create express app
const app = express();
app.get('/', (req, res) => res.send('Indexing local server'));

/**
 * Uploads file to azure
 * @param {*} endpoint
 * @param {*} clientId
 * @param {*} file
 */
const uploadToAzure = (endpoint, clientId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  axios
    .post(endpoint, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
        Parametro: clientId,
      },
    })
    .then(function (response) {
      console.log(response.data, response.status);
    })
    .catch(function (error) {
      console.log(error);
    });
};

/**
 * Runs file detection
 * @param {*} path
 * @param {*} cb
 */
const runFilesDetection = (path, cb) => {
  const watcher = chokidar.watch(path, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles,
    persistent: true,
  });

  watcher.on('add', (path) => {
    log(`File ${path} has been added`);

    const stream = fs.createReadStream(path);
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

// run file changing detection
const downloadsPath = DonwloadsFolder();
runFilesDetection(`${downloadsPath}/${process.env.INDEX_FOLDER}`, (eventName, result) => {
  // console.log({ eventName, result });
  if (eventName === 'add') {
    const UPLOAD_FILE_ENDPOINT = process.env.UPLOAD_FILE_ENDPOINT || '';
    const CLIENT_ID = process.env.CLIENT_ID || 1;
    uploadToAzure(UPLOAD_FILE_ENDPOINT, Number(CLIENT_ID), result);
  }
});

// init server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));
