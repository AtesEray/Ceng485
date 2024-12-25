// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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

    // Register a vehicle to the sender's address
    function registerVehicle(string memory vin, string memory plateNumber) public {
        require(vehicles[vin].owner == address(0), "Vehicle already registered");
        vehicles[vin] = VehicleInfo(vin, plateNumber, msg.sender);
        emit VehicleRegistered(vin, plateNumber, msg.sender);
    }

    // Transfer ownership of a vehicle to a new owner
    function transferOwnership(string memory vin, address newOwner) public onlyOwner(vin) {
        address previousOwner = vehicles[vin].owner;
        vehicles[vin].owner = newOwner;
        emit OwnershipTransferred(vin, previousOwner, newOwner);
    }

    function getVehicleInfo(string memory vin) public view returns (string memory, string memory, address) {
        VehicleInfo memory vehicleInfo = vehicles[vin];
        return (vehicleInfo.vin, vehicleInfo.plateNumber, vehicleInfo.owner);
    }


}
