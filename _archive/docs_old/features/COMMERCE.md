# 💳 Feature: Hybrid Commerce (Buying & Selling)

## Overview
We support two distinct purchasing methods to maximize accessibility: **Direct Crypto** (Web3) and **Fiat/Credit Card** (Web2 + Web3 Bridge).

## 1. Crypto Payments (Native)
Direct peer-to-peer transaction on the blockchain.

- **Buyer**: Connects wallet (e.g., MetaMask).
- **Action**: Calls `purchaseProduct(id)` with the required ETH/Stablecoin value.
- **Process**:
  1. Smart contract verifies `msg.value >= price`.
  2. Funds transferred instantly to Seller.
  3. Ownership (`product.owner`) updated to Buyer.
  4. Product marked as `sold`.
- **Pros**: Trustless, instant settlement, low fees (~$0.001 on Tempo).

## 2. Fiat Payments (Stripe Integration)
Allows users without crypto to buy assets using a credit card.

- **Buyer**: Enters card details in Stripe Elements UI.
- **Action**: "Pay Now".
- **Process**:
  1. Frontend creates Payment Intent via Backend.
  2. User confirms payment.
  3. **Webhook Trigger**: Stripe notifies Backend of success (`payment_intent.succeeded`).
  4. **Admin Execution**: The Backend's `ADMIN_WALLET` executes the `purchaseProduct` transaction on the blockchain *on behalf of the user*.
  5. The Asset is transferred to the user's (or a generated) wallet address.
- **Pros**: Zero crypto friction for new users.

## 📊 Fee Structure
- **Platform Fee**: Currently 0% (Growth Mode).
- **Gas Fee**: Paid by Buyer (Crypto) or Platform Admin (Fiat).
