// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Report {
    struct ReportDetails {
        uint256 id; // Unique report ID
        string vin; // Vehicle Identification Number
        string reportHash; // IPFS hash of the report
        address inspector; // Inspector address
        uint256 timestamp; // Timestamp of report creation
    }

    uint256 public reportCounter;
    mapping(uint256 => ReportDetails) public reports; // Report ID to details

    event ReportCreated(uint256 id, string vin, string reportHash, address inspector, uint256 timestamp);

    function createReport(string memory vin, string memory reportHash) public {
        reportCounter++;
        reports[reportCounter] = ReportDetails(reportCounter, vin, reportHash, msg.sender, block.timestamp);
        emit ReportCreated(reportCounter, vin, reportHash, msg.sender, block.timestamp);
    }

    function getReport(uint256 id) public view returns (ReportDetails memory) {
        return reports[id];
    }
}
