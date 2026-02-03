import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pinataSDK = require('@pinata/sdk');

import fs from 'fs';
import path from 'path';

// Initialize Pinata SDK
// Keys should be loaded from environment variables
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY, 
  process.env.PINATA_SECRET_KEY
);

export class PinataService {
  constructor() {
    // Verify connection on startup
    this.testConnection();
  }

  async testConnection() {
    try {
      const result = await pinata.testAuthentication();
      console.log('✅ Pinata connected:', result);
    } catch (error) {
      console.warn('⚠️ Pinata connection failed. Check your API keys in .env');
    }
  }

  /**
   * Upload a file to IPFS
   * @param filePath Absolute path to the file
   * @param name Optional name for the file on IPFS
   * @returns The IPFS CID (hash)
   */
  async uploadFile(filePath: string, name?: string): Promise<string> {
    try {
      const readableStreamForFile = fs.createReadStream(filePath);
      const options = {
        pinataMetadata: {
          name: name || path.basename(filePath),
        },
      };

      const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
      return result.IpfsHash;
    } catch (error) {
      console.error('Error uploading file to Pinata:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  /**
   * Upload JSON metadata to IPFS
   * @param metadata The JSON object
   * @param name name for the metadata file
   * @returns The IPFS CID
   */
  async uploadJSON(metadata: object, name: string): Promise<string> {
    try {
      const options = {
        pinataMetadata: {
          name: name,
        },
      };

      const result = await pinata.pinJSONToIPFS(metadata, options);
      console.log('Pinned Metadata:', result);
      return result.IpfsHash;
    } catch (error) {
      console.error('Error uploading JSON to Pinata:', error);
      throw new Error('Failed to upload metadata to IPFS');
    }
  }
}

export const pinataService = new PinataService();
