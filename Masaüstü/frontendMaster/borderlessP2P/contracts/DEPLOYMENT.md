# BorderlessP2P - Deployment Guide

This documentation explains step-by-step how to deploy the BorderlessP2P contract to Stellar Testnet.

## 📋 Prerequisites

- Rust (latest stable)
- Soroban CLI v22.8.1+
- Stellar Testnet account
- Git

## 🚀 Deployment Steps

### 1. Required Tools Installation

#### Rust and WASM Target
```bash
# Rust installation (if not installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Add WASM target
rustup target add wasm32-unknown-unknown
```

#### Soroban CLI Installation
```bash
cargo install --locked soroban-cli
```

### 2. Project Preparation

#### Clone Project
```bash
git clone <repository-url>
cd contract/contracts/hello-world
```

#### Check Dependencies
```bash
cargo check
```

### 3. Testnet Account Creation

#### Generate Identity
```bash
stellar keys generate test
```

#### Testnet Configuration
```bash
stellar network use testnet
```

#### Fund Account
```bash
stellar keys fund test
```

### 4. Contract Compilation

#### WASM Compilation
```bash
soroban contract build
```

**Output**: `target/wasm32v1-none/release/hello_world.wasm`

#### Compilation Verification
```bash
ls -la target/wasm32v1-none/release/hello_world.wasm
```

### 5. Contract Deployment

#### Deploy Command
```bash
soroban contract deploy \
  --wasm target/wasm32v1-none/release/hello_world.wasm \
  --source test
```

#### Successful Deploy Output
```
✅ Deployed!
CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO
```

**Contract ID**: `CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO`

## 🧪 Post-Deployment Tests

### 1. Product Addition Test

#### Create Test Address
```bash
stellar keys generate seller
stellar keys show seller
```

#### Add Product
```bash
stellar contract invoke \
  --id CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO \
  --source test \
  -- add_product \
  --seller <SELLER_ADDRESS> \
  --title 0000000000000000000000000000000000000000000000000000000000000000 \
  --desc 00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 \
  --price 1000
```

#### List Products
```bash
stellar contract invoke \
  --id CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO \
  --source test \
  -- list_products
```

### 2. Other Module Tests

#### Request System
```bash
# Add request
stellar contract invoke \
  --id CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO \
  --source test \
  -- add_request \
  --requester test \
  --product_title 0000000000000000000000000000000000000000000000000000000000000000 \
  --details 00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000

# List requests
stellar contract invoke \
  --id CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO \
  --source test \
  -- list_requests
```

#### Escrow System
```bash
# Add escrow
stellar contract invoke \
  --id CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO \
  --source test \
  -- add_escrow \
  --buyer test \
  --seller seller \
  --amount 500

# List escrows
stellar contract invoke \
  --id CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO \
  --source test \
  -- list_escrows
```

#### DAO System
```bash
# Add proposal
stellar contract invoke \
  --id CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO \
  --source test \
  -- add_proposal \
  --proposer test \
  --description test

# List proposals
stellar contract invoke \
  --id CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO \
  --source test \
  -- list_proposals
```

#### NFT System
```bash
# Mint NFT
stellar contract invoke \
  --id CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO \
  --source test \
  -- mint_nft \
  --owner test \
  --score 42

# List NFTs
stellar contract invoke \
  --id CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO \
  --source test \
  -- list_nfts
```

#### Delivery System
```bash
# Add delivery proof
stellar contract invoke \
  --id CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO \
  --source test \
  -- add_delivery \
  --tx_id 0000000000000000000000000000000000000000000000000000000000000000 \
  --deliverer seller \
  --ipfs_hash 0000000000000000000000000000000000000000000000000000000000000000

# List delivery proofs
stellar contract invoke \
  --id CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO \
  --source test \
  -- list_deliveries
```

## 🔍 Contract Verification

### Check on Stellar Expert
- [Contract Explorer](https://stellar.expert/explorer/testnet/contract/CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO)

### Function Schema Check
```bash
stellar contract invoke \
  --id CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO \
  --source test \
  -- --help
```

## 🚨 Troubleshooting

### Common Errors

#### 1. "Account not found" Error
```bash
# Refund account
stellar keys fund test
```

#### 2. "WASM file not found" Error
```bash
# Rebuild contract
soroban contract build
```

#### 3. "Network configuration error" Error
```bash
# Reconfigure testnet
stellar network use testnet
```

#### 4. "Insufficient balance" Error
```bash
# Refund account
stellar keys fund test
```

### Debug Commands

#### Identity Check
```bash
stellar keys show test
```

#### Network Status
```bash
stellar network list
```

#### Contract Status
```bash
stellar contract show CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO
```

## 📊 Deployment Summary

- **Contract ID**: `CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO`
- **Network**: Stellar Testnet
- **Deploy Date**: [Deploy date]
- **WASM Hash**: `e37561411e54a7ed05ba736fb7b1d337778a385c429516260afd8521adf18878`
- **Status**: ✅ Active

## 🔗 Useful Links

- [Stellar Developer Portal](https://developers.stellar.org)
- [Soroban Documentation](https://soroban.stellar.org)
- [Stellar Expert Explorer](https://stellar.expert)
- [Soroban CLI Docs](https://developers.stellar.org/docs/tools/developer-tools/cli/stellar-cli)

---

**Note**: This deployment guide is prepared for Stellar Testnet. Additional security measures and tests are required for production deployment. 