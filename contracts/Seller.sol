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
