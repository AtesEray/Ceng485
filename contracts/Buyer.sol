// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Seller {
    struct Listing {
        uint256 price;
        bool isActive;
    }

    function listings(string memory vin) external view returns (Listing memory);
    function cancelListing(string memory vin) external;
}

interface Owner {
    function vehicles(string memory vin) external view returns (string memory, string memory, address);
    function transferOwnership(string memory vin, address newOwner) external;
}

contract Buyer {
    struct Purchase {
        string vin;
        uint256 price;
        address buyer;
    }

    mapping(string => Purchase) public purchases;
    Seller private sellerContract;
    Owner private ownerContract;

    event VehiclePurchased(string vin, address buyer, uint256 price);

    constructor(address sellerContractAddress, address ownerContractAddress) {
        sellerContract = Seller(sellerContractAddress);
        ownerContract = Owner(ownerContractAddress);
    }

    // Buy a vehicle by VIN
    function buyVehicle(string memory vin) public payable {
        Seller.Listing memory listing = sellerContract.listings(vin);
        require(listing.isActive, "Vehicle not listed for sale");
        require(msg.value == listing.price, "Incorrect value sent");

        (, , address vehicleOwner) = ownerContract.vehicles(vin);
        require(vehicleOwner != address(0), "Vehicle does not exist");

        // Update state before transferring funds
        ownerContract.transferOwnership(vin, msg.sender);
        purchases[vin] = Purchase(vin, listing.price, msg.sender);
        sellerContract.cancelListing(vin);

        // Transfer funds to the seller
        (bool success, ) = vehicleOwner.call{value: msg.value}("");
        require(success, "Transfer failed");

        emit VehiclePurchased(vin, msg.sender, listing.price);
    }

    // Prevent accidental direct payments to the contract
    receive() external payable {
        revert("Direct payments not allowed");
    }
}
