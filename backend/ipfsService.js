const ipfs = require('../ipfs');

const uploadToIPFS = async (data) => {
  try {
    const result = await ipfs.add(data);
    console.log('IPFS Hash:', result.path);
    return result.path; // Returns IPFS hash
  } catch (error) {
    console.error('IPFS upload failed:', error);
    throw error;
  }
};

module.exports = { uploadToIPFS };
