# Smart Contracts

## Overview
The core logic of the marketplace resides in the `Marketplace.sol` contract deployed on the **Tempo Blockchain**.

## 🔗 Deployment Details
- **Network**: Tempo Testnet (Primary)
- **Chain ID**: 42429
- **Currency**: USD (Stablecoin Gas)

## 📜 Contract: `Marketplace.sol`

### Key Data Structures
```solidity
struct Product {
    uint256 id;
    string name;
    uint256 price;
    address payable seller;
    address owner;
    bool sold;
}
```

### Main Functions

#### `createProduct(string name, uint256 price)`
- **Purpose**: Lists a new item for sale.
- **Events**: Emits `ProductCreated`.
- **Requirements**: Price > 0.

#### `purchaseProduct(uint256 id)`
- **Purpose**: Buys a listed item.
- **Payable**: Requires `msg.value` >= `product.price`.
- **Logic**: Transfers funds to seller, transfers ownership to buyer.
- **Events**: Emits `ProductPurchased`.

### Tempo Integration Notes
- **Gas Fees**: Paid in stablecoins (USDC/USDT equivalent) natively.
- **Speed**: Optimized for high throughput, sub-second finality.
- **Compatibility**: 100% EVM compatible, uses standard Ethereum tooling (Hardhat, Ethers.js).

## 🧪 Testing
Run the test suite using Hardhat:
```bash
cd marketplace-contracts
npx hardhat test
```
