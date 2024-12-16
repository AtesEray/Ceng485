// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VehicleInspection {
    struct Certificate {
        string certID;         // Unique ID for the certificate
        string user;           // User who requests the certificate
        string signer;         // Signer of the certificate
        string details;        // Certificate details
        bool isSigned;         // Status of signing
        bool isValidated;      // Status of validation
        uint timestamp;        // Creation time
    }

    mapping(string => Certificate) public certificates;

    event CertificateCreated(string certID, string user, string details);
    event CertificateSigned(string certID, string signer);
    event CertificateValidated(string certID, bool isValid);

    // Create a new certificate
    function createCertificate(string memory certID, string memory user, string memory details) public {
        require(bytes(certID).length > 0, "Certificate ID is required");
        require(bytes(user).length > 0, "User is required");
        require(bytes(details).length > 0, "Details are required");

        certificates[certID] = Certificate({
            certID: certID,
            user: user,
            signer: "",
            details: details,
            isSigned: false,
            isValidated: false,
            timestamp: block.timestamp
        });

        emit CertificateCreated(certID, user, details);
    }

    // Sign a certificate
    function signCertificate(string memory certID, string memory signer) public {
        require(bytes(certificates[certID].certID).length > 0, "Certificate does not exist");
        require(!certificates[certID].isSigned, "Certificate already signed");
        require(bytes(signer).length > 0, "Signer is required");

        certificates[certID].isSigned = true;
        certificates[certID].signer = signer;
        emit CertificateSigned(certID, signer);
    }

    // Validate a signed certificate
    function validateCertificate(string memory certID, bool isValid) public {
        require(bytes(certificates[certID].certID).length > 0, "Certificate does not exist");
        require(certificates[certID].isSigned, "Certificate is not signed");

        certificates[certID].isValidated = isValid;
        emit CertificateValidated(certID, isValid);
    }

    // Fetch certificate details
    function getCertificate(string memory certID)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            bool,
            bool,
            uint
        )
    {
        Certificate memory cert = certificates[certID];
        require(bytes(cert.certID).length > 0, "Certificate does not exist");

        return (
            cert.certID,
            cert.user,
            cert.signer,
            cert.details,
            cert.isSigned,
            cert.isValidated,
            cert.timestamp
        );
    }
}
