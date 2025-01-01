import React, { useState } from 'react';
import { create } from 'ipfs-http-client';

// IPFS istemcisi oluşturma
const ipfs = create({ url: 'https://ipfs.infura.io:6001/api/v0' });

const IPFSUpload = ({ contract, account }) => {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState('');

  // Dosya seçimi
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // IPFS'ye dosya yükleme ve blockchain'e kaydetme
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }
  
    try {
      const added = await ipfs.add(selectedFile);
      console.log("CID:", added.path);
      setHash(added.path);
  
      // Dosyayı sabitleme
      await ipfs.pin.add(added.path);
      console.log("File pinned:", added.path);
  
      alert("File uploaded and pinned to IPFS!");
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      alert("Failed to upload file to IPFS.");
    }
  };
  
  

  return (
    <div className="container">
      <h1>Upload File to IPFS</h1>
      <input type="file" onChange={handleFileChange} />
      <button className="button" onClick={handleUpload}>
        Upload
      </button>
      {hash && (
        <p>
          File Hash:{' '}
          <a
            href={`https://ipfs.io/ipfs/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {hash}
          </a>
        </p>
      )}
    </div>
  );
};

export default IPFSUpload;
