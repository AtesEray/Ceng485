// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interface for the Seller contract
interface Seller {
    struct Listing {
        uint256 price;
        bool isActive;
    }

    // Function to get the listing of a vehicle by VIN
    function listings(string memory vin) external view returns (Listing memory);

    // Function to cancel a vehicle listing by VIN
    function cancelListing(string memory vin) external;

    // Function to get all active listings for a seller
    function getSellerListings(address seller) external view returns (string[] memory, uint256[] memory, bool[] memory);
}

// Implementation of the Seller contract
contract SellerContract is Seller {
    // Mapping to store listings for each vehicle VIN
    mapping(string => Listing) public vehicleListings;

    // Mapping to store the list of vehicles for each seller
    mapping(address => string[]) public sellerVehicles;

    // Function to add a new vehicle listing
    function addListing(string memory vin, uint256 price) public {
        vehicleListings[vin] = Listing(price, true); // Add or update the listing
        sellerVehicles[msg.sender].push(vin); // Add the VIN to the seller's list of vehicles
    }

    // Function to get the listing for a specific vehicle
    function listings(string memory vin) public view override returns (Listing memory) {
        return vehicleListings[vin];
    }

    // Function to cancel a listing for a specific vehicle
    function cancelListing(string memory vin) public override {
        require(vehicleListings[vin].isActive, "Listing not active");
        vehicleListings[vin].isActive = false; // Mark the listing as inactive
    }

    // Function to get all active listings for a specific seller
    function getSellerListings(address seller) public view override returns (string[] memory, uint256[] memory, bool[] memory) {
        string[] memory vins = sellerVehicles[seller];
        uint256[] memory prices = new uint256[](vins.length);
        bool[] memory isActive = new bool[](vins.length);
        
        for (uint i = 0; i < vins.length; i++) {
            Listing memory listing = vehicleListings[vins[i]];
            prices[i] = listing.price;
            isActive[i] = listing.isActive;
        }

        return (vins, prices, isActive);
    }
}
