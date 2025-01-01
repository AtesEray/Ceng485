// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Owner {
    struct VehicleInfo {
        string vin; // Vehicle Identification Number
        string plateNumber;
        address owner; // Owner address
    }

    mapping(string => VehicleInfo) public vehicles;

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

    function getVehicleOwner(string memory vin) public view returns (address) {
        return vehicles[vin].owner;
    }
}
