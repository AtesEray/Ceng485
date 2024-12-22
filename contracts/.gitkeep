// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Contract to manage vehicle ownership and information
contract Owner {
    struct VehicleInfo {
        string vin; // Vehicle Identification Number
        string plateNumber;
        address owner; // Owner address
    }

    mapping(string => VehicleInfo) public vehicles; // Mapping from VIN to VehicleInfo

    event VehicleRegistered(string vin, string plateNumber, address owner);
    event OwnershipTransferred(string vin, address previousOwner, address newOwner);

    modifier onlyOwner(string memory vin) {
        require(vehicles[vin].owner == msg.sender, "Not the vehicle owner");
        _;
    }

    function registerVehicle(string memory vin, string memory plateNumber) public {
        require(vehicles[vin].owner == address(0), "Vehicle already registered");
        vehicles[vin] = VehicleInfo(vin, plateNumber, msg.sender);
        emit VehicleRegistered(vin, plateNumber, msg.sender);
    }

    function transferOwnership(string memory vin, address newOwner) public onlyOwner(vin) {
        address previousOwner = vehicles[vin].owner;
        vehicles[vin].owner = newOwner;
        emit OwnershipTransferred(vin, previousOwner, newOwner);
    }
}





// Contract to manage sellers
contract Seller {
    struct SellerInfo {
        address sellerAddress; // Address of the seller
        bool isRegistered; // Registration status
    }

    struct Listing {
        string vin; // Vehicle Identification Number
        uint256 price; // Price in wei
        bool isActive; // Listing status
    }

    mapping(address => SellerInfo) public sellers; // Seller address to SellerInfo
    mapping(string => Listing) public listings; // VIN to Listing

    Owner private ownerContract;

    event SellerRegistered(address seller);
    event VehicleListed(string vin, uint256 price, address seller);
    event ListingCancelled(string vin, address seller);

    modifier onlyRegisteredSeller() {
        require(sellers[msg.sender].isRegistered, "Not a registered seller");
        _;
    }

    modifier onlyVehicleOwner(string memory vin) {
        (, , address owner) = ownerContract.vehicles(vin);
        require(owner == msg.sender, "Not the vehicle owner");
        _;
    }

    constructor(address ownerContractAddress) {
        ownerContract = Owner(ownerContractAddress);
    }

    function registerSeller() public {
        require(!sellers[msg.sender].isRegistered, "Already registered as a seller");
        sellers[msg.sender] = SellerInfo(msg.sender, true);
        emit SellerRegistered(msg.sender);
    }

    function listVehicle(string memory vin, uint256 price) public onlyRegisteredSeller onlyVehicleOwner(vin) {
        require(price > 0, "Price must be greater than zero");
        require(!listings[vin].isActive, "Vehicle is already listed");

        listings[vin] = Listing(vin, price, true);
        emit VehicleListed(vin, price, msg.sender);
    }

    function cancelListing(string memory vin) public onlyRegisteredSeller {
        Listing storage listing = listings[vin];
        require(listing.isActive, "Listing is not active");

        (, , address owner) = ownerContract.vehicles(vin);
        require(owner == msg.sender, "Not the owner of the vehicle");

        listing.isActive = false;
        emit ListingCancelled(vin, msg.sender);
    }
}


// Contract to manage reports
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