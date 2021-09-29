import { BlobServiceClient } from '@azure/storage-blob';
import { uuidv1 } from 'uuid';
import { Logger } from '../scripts/logger';

const createContainer = async () => {
  // Create the BlobServiceClient object which will be used to create a container client
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING,
  );

  // Create a unique name for the container
  const containerName = `ils` + uuidv1();

  Logger.log('\nCreating container...');
  Logger.log('\t', containerName);

  // Get a reference to the container
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Create the container
  const containerResponse = await containerClient.create();
  Logger.log('Container was created successfully. requestId: ', containerResponse.requestId);
};
