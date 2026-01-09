# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Tempo Blockchain Support**:
  - Migrated smart contracts to Tempo Testnet (Chain ID 42429).
  - Configured Hardhat user config for primary Tempo RPC.
  - Added network switching logic to `WalletContext`.
- **Documentation**:
  - Added `quickstart.md` for one-command startup.
  - Initialized `docs/` structure for comprehensive project documentation.

### Changed
- **UI/UX Refinement**:
  - Overhauled Dark Theme to "Premium Midnight Blue" (`hsl(230 35% 7%)`).
  - Fixed Material-UI theme synchronization with Tailwind.
  - Removed "external blue glow" artifacts for a cleaner look.
- **Backend Configuration**:
  - Restored backend service to Port 3001.
  - Added robust error handling for server startup.

### Removed
- Legacy files: `src/App.test.js`, `src/CategorySidebar.js`, `src/reportWebVitals.js`, `src/setupTests.js`.

## [0.1.0] - 2025-11-26
### Added
- Initial project scaffold (React Frontend + Express Backend + Hardhat).
- Basic Marketplace smart contract (ERC721-like).
- Stripe payment integration fundamentals.
