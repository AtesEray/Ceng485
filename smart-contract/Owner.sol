// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SafeRemotePurchase {
    address public buyer;
    address public seller;
    uint256 public price;
    bool public buyerConfirmed;
    bool public sellerConfirmed;

    enum State { Created, Locked, Released, Inactive }
    State public state;

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer can call this function.");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this function.");
        _;
    }

    modifier inState(State _state) {
        require(state == _state, "Invalid state.");
        _;
    }

    event PurchaseConfirmed(address buyer);
    event ItemReceived(address buyer);
    event SellerRefunded(address seller);

    constructor(address _seller, uint256 _price) payable {
        require(msg.value == 2 * _price, "Deposit must be double the price.");
        seller = _seller;
        price = _price;
        state = State.Created;
    }

    function confirmPurchase() external inState(State.Created) payable {
        require(msg.value == price, "Payment must match the price.");
        buyer = msg.sender;
        state = State.Locked;
        emit PurchaseConfirmed(buyer);
    }

    function confirmReceipt() external onlyBuyer inState(State.Locked) {
        state = State.Released;
        payable(seller).transfer(price);
        emit ItemReceived(buyer);
    }

    function refundSeller() external onlySeller inState(State.Released) {
        state = State.Inactive;
        payable(seller).transfer(price);
        emit SellerRefunded(seller);
    }

    function abort() external onlySeller inState(State.Created) {
        state = State.Inactive;
        payable(seller).transfer(address(this).balance);
    }

    function refundBuyer() external onlyBuyer inState(State.Locked) {
        state = State.Inactive;
        payable(buyer).transfer(price);
    }

    // Handle direct Ether transfers without data
    receive() external payable {
        revert("Direct Ether transfers not allowed.");
    }

    // Handle calls with unexpected data
    fallback() external payable {
        revert("Fallback function triggered.");
    }
}
