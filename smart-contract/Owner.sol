// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PurchaseAgreement{

    uint public value;
    address payable seller;
    address payable buyer;

    enum State {Created , Locked , Release ,Inactive}
    State public state;

    constructor() payable {
        seller = payable(msg.sender);
    }

    error InvalidState();

    modifier inState( State state_)
    {
        if (state != state_)
        {
            revert InvalidState();
        }

        _;  
    }

    function confrimPurchase() external inState(State.Created) payable{

        require(msg.value ==(2*value), "enter 2x purchase amount");
        buyer = payable(msg.sender);
        state = State.Locked
    }


}

