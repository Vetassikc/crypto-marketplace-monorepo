# Database Schema Specification

## Overview
The database uses PostgreSQL managed by Prisma ORM. It serves as the single source of truth for Users, Orders, and Listings.

## Core Models

### User
*   `id`: CUID
*   `role`: BUYER (Default), SELLER, ADMIN
*   `image`: For profile pictures (stored in S3/IPFS)

### Wallet (Web3)
*   `address`: Unique blockchain address.
*   `network`: 'tempo', 'solana', 'base'.
*   Links 1:1 or 1:N with User accounts.

### Listing
*   `price`: Decimal (for high precision).
*   `currency`: Default USDC (Tempo native).

### Order
*   `status`: PENDING -> PAID -> SHIPPED -> COMPLETED.
*   `txHash`: Stores the blockchain transaction proof.
