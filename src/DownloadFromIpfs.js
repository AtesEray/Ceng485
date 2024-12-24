import React, { useState } from 'react';

const DownloadFromIPFS = () => {
  const [hash, setHash] = useState('');
  const [data, setData] = useState('');

  const handleDownload = async () => {
    try {
      const response = await fetch(`http://localhost:3000/download/${hash}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data from IPFS');
      }
      const fetchedData = await response.text();
      setData(fetchedData); // Gelen veriyi state'e kaydet
    } catch (error) {
      console.error('Error downloading from IPFS:', error);
      setData('Error fetching data');
    }
  };

  return (
    <div>
      <h2>Download from IPFS</h2>
      <input
        type="text"
        placeholder="Enter IPFS Hash"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
      />
      <button onClick={handleDownload}>Download</button>
      <div>
        <h3>Fetched Data:</h3>
        <p>{data}</p>
      </div>
    </div>
  );
};

export default DownloadFromIPFS;
