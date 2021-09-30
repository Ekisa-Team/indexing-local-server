import axios from 'axios';
import { ReadStream } from 'fs';
import FormData from 'form-data';

const uploadToAzure = (endpoint: string, clientId: number, file: ReadStream) => {
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

export const Api = { uploadToAzure };
