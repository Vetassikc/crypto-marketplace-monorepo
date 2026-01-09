# 🎨 Feature: Digital Asset Minting

## Overview
The Minting features allows ANY verified seller to transform a digital file (Image) into a tradeable asset on the blockchain. This process involves uploading content, defining metadata, and executing a smart contract transaction.

## 🛠 Flow Description

1. **Asset Upload**:
   - User selects an image file (JPG, PNG, WEBP).
   - Backend securely stores the file and generates a public URL.
   
2. **Metadata Creation**:
   - Title & Description: Defines the asset's identity.
   - **Properties (JSON)**: Users can add custom attributes (e.g., "Color: Blue", "Rarity: Legendary"). These are stored as JSON strings on-chain or in the backend database linked to the Token ID.

3. **On-Chain Minting**:
   - The frontend calls `createProduct(name, price)` on the `Marketplace.sol` contract.
   - **Cost**: The seller pays a small gas fee in stablecoins (Tempo).
   - **Result**: The contract increments the `productCount` and assigns a unique `productId`.

4. **Indexing**:
   - The Backend listens for the `ProductCreated` event.
   - It automatically syncs the new blockchain item into the PostgreSQL database for instant searchability.

## 💻 Tech Implementation
- **Contract Function**: `createProduct(string memory _name, uint256 _price)`
- **Frontend Hook**: `useMintProduct()` (wrapper around ethers.js)
- **Validation**: Requires user to be authenticated via Wallet AND JWT (for backend upload).
