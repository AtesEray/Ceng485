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

    function buyVehicle(string memory vin) public payable {
        Seller.Listing memory listing = sellerContract.listings(vin);
        require(listing.isActive, "Vehicle not listed for sale");
        require(msg.value == listing.price, "Incorrect value sent");

        (, , address vehicleOwner) = ownerContract.vehicles(vin);
        payable(vehicleOwner).transfer(msg.value);

        ownerContract.transferOwnership(vin, msg.sender);

        purchases[vin] = Purchase(vin, listing.price, msg.sender);
        sellerContract.cancelListing(vin);

        emit VehiclePurchased(vin, msg.sender, listing.price);
    }
}
