import React, { useState } from 'react';

const UploadToIPFS = () => {
  const [data, setData] = useState('');

  const handleUpload = async () => {
    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });
      const result = await response.json();
      if (result.success) {
        alert(`IPFS Hash: ${result.ipfsHash}`);
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
    }
  };

  return (
    <div>
      <textarea
        placeholder=\"Enter data to upload to IPFS\"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      <button onClick={handleUpload}>Upload to IPFS</button>
    </div>
  );
};

export default UploadToIPFS;
