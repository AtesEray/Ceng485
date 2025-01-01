// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentStore {
    struct Document {
        string ipfsHash; // IPFS hash
        string description; // Dosya açıklaması
        address uploader; // Yükleyen kişi
    }

    Document[] public documents;

    event DocumentAdded(string ipfsHash, string description, address uploader);

    function addDocument(string memory ipfsHash, string memory description) public {
        documents.push(Document(ipfsHash, description, msg.sender));
        emit DocumentAdded(ipfsHash, description, msg.sender);
    }

    function getDocument(uint256 index) public view returns (string memory, string memory, address) {
        require(index < documents.length, "Invalid index");
        Document memory doc = documents[index];
        return (doc.ipfsHash, doc.description, doc.uploader);
    }

    function getDocumentCount() public view returns (uint256) {
        return documents.length;
    }
}
