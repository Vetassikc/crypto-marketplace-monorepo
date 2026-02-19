// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract Escrow {
    enum State { AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETE, REFUNDED }

    struct Transaction {
        uint256 id;
        uint256 orderId;
        address buyer;
        address seller;
        uint256 amount;
        State state;
        uint256 createdAt;
    }

    uint256 public nextTransactionId;
    mapping(uint256 => Transaction) public transactions;
    
    // Address of the payment token (AUSD on Tempo)
    address public paymentToken;

    event EscrowCreated(uint256 indexed transactionId, uint256 orderId, address buyer, address seller, uint256 amount);
    event FundsReleased(uint256 indexed transactionId, address seller, uint256 amount);
    event FundsRefunded(uint256 indexed transactionId, address buyer, uint256 amount);

    constructor(address _paymentToken) {
        require(_paymentToken != address(0), "Invalid payment token");
        paymentToken = _paymentToken;
    }

    // Create a new escrow transaction
    // The buyer calls this function. They must have approved the contract to spend 'amount' of tokens.
    function createEscrow(uint256 _orderId, address _seller, uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(_seller != address(0), "Invalid seller address");
        require(_seller != msg.sender, "Buyer cannot be seller");

        // Transfer tokens from buyer to this contract
        bool success = IERC20(paymentToken).transferFrom(msg.sender, address(this), _amount);
        require(success, "Token transfer failed");

        uint256 transactionId = nextTransactionId++;
        
        transactions[transactionId] = Transaction({
            id: transactionId,
            orderId: _orderId,
            buyer: msg.sender,
            seller: _seller,
            amount: _amount,
            state: State.AWAITING_DELIVERY,
            createdAt: block.timestamp
        });

        emit EscrowCreated(transactionId, _orderId, msg.sender, _seller, _amount);
    }

    // Release funds to the seller
    function releaseFunds(uint256 _transactionId) external {
        Transaction storage txn = transactions[_transactionId];
        require(msg.sender == txn.buyer, "Only buyer can release funds");
        require(txn.state == State.AWAITING_DELIVERY, "Invalid state");

        txn.state = State.COMPLETE;
        
        bool success = IERC20(paymentToken).transfer(txn.seller, txn.amount);
        require(success, "Token transfer failed");

        emit FundsReleased(_transactionId, txn.seller, txn.amount);
    }

    // Refund funds to the buyer
    function refundBuyer(uint256 _transactionId) external {
        Transaction storage txn = transactions[_transactionId];
        require(msg.sender == txn.seller, "Only seller can refund");
        require(txn.state == State.AWAITING_DELIVERY, "Invalid state");

        txn.state = State.REFUNDED;
        
        bool success = IERC20(paymentToken).transfer(txn.buyer, txn.amount);
        require(success, "Token transfer failed");

        emit FundsRefunded(_transactionId, txn.buyer, txn.amount);
    }
    
    // Helper to get transaction details
    function getTransaction(uint256 _transactionId) external view returns (Transaction memory) {
        return transactions[_transactionId];
    }
}
