# BorderlessP2P - Soroban Smart Contract

BorderlessP2P is a decentralized P2P marketplace smart contract developed with Soroban SDK 22.0.0 on the Stellar blockchain.

## 🚀 Features

- **Product Management**: Add and list products
- **Request System**: Manage user product requests
- **Escrow System**: Secure payment transactions
- **DAO Management**: Decentralized autonomous organization proposals
- **NFT System**: Reputation NFTs
- **Delivery Proofs**: IPFS-based delivery verification

## 📁 Project Structure

```
contracts/hello-world/src/
├── lib.rs          # Main contract and functions
├── product.rs      # Product management module
├── requests.rs     # Request system module
├── escrow.rs       # Escrow payment system
├── dao.rs          # DAO governance module
├── nft.rs          # NFT reputation system
└── delivery.rs     # Delivery proof system
```

## 🛠️ Setup

### Prerequisites

- Rust (latest stable version)
- Soroban CLI
- Stellar testnet account

### Installation

1. **Install Soroban CLI:**
   ```bash
   curl -sSfL https://soroban.stellar.org/install.sh | sh
   ```

2. **Clone and build:**
   ```bash
   git clone <repository-url>
   cd contract
   cargo build --target wasm32-unknown-unknown/release
   ```

## 🧪 Testing

Run the test suite:
```bash
cargo test
```

## 🚀 Deployment

1. **Set up Stellar identity:**
   ```bash
   soroban config identity generate my-account
   soroban config network add testnet --global --rpc-url https://soroban-testnet.stellar.org --network-passphrase "Test SDF Network ; September 2015"
   ```

2. **Fund your account:**
   ```bash
   soroban config identity fund my-account --network testnet
   ```

3. **Deploy the contract:**
   ```bash
   soroban contract deploy --wasm target/wasm32-unknown-unknown/release/hello_world.wasm --network testnet --source my-account
   ```

## 📖 Usage

### Product Management
```bash
# Add a product
soroban contract invoke --id <CONTRACT_ID> --network testnet --source my-account -- add_product --seller <SELLER_ADDRESS> --title <PRODUCT_TITLE> --desc <DESCRIPTION> --price <PRICE>

# List products
soroban contract invoke --id <CONTRACT_ID> --network testnet --source my-account -- list_products
```

### Request System
```bash
# Add a request
soroban contract invoke --id <CONTRACT_ID> --network testnet --source my-account -- add_request --requester <REQUESTER_ADDRESS> --product_title <PRODUCT_TITLE> --details <DETAILS>

# List requests
soroban contract invoke --id <CONTRACT_ID> --network testnet --source my-account -- list_requests
```

### Escrow System
```bash
# Create escrow
soroban contract invoke --id <CONTRACT_ID> --network testnet --source my-account -- add_escrow --buyer <BUYER_ADDRESS> --seller <SELLER_ADDRESS> --amount <AMOUNT>

# List escrows
soroban contract invoke --id <CONTRACT_ID> --network testnet --source my-account -- list_escrows
```

### DAO Governance
```bash
# Add proposal
soroban contract invoke --id <CONTRACT_ID> --network testnet --source my-account -- add_proposal --proposer <PROPOSER_ADDRESS> --description <DESCRIPTION>

# List proposals
soroban contract invoke --id <CONTRACT_ID> --network testnet --source my-account -- list_proposals
```

### NFT System
```bash
# Mint NFT
soroban contract invoke --id <CONTRACT_ID> --network testnet --source my-account -- mint_nft --owner <OWNER_ADDRESS> --score <SCORE>

# List NFTs
soroban contract invoke --id <CONTRACT_ID> --network testnet --source my-account -- list_nfts
```

### Delivery Proofs
```bash
# Add delivery proof
soroban contract invoke --id <CONTRACT_ID> --network testnet --source my-account -- add_delivery --tx_id <TX_ID> --deliverer <DELIVERER_ADDRESS> --ipfs_hash <IPFS_HASH>

# List deliveries
soroban contract invoke --id <CONTRACT_ID> --network testnet --source my-account -- list_deliveries
```

## 🔧 Configuration

The contract uses Soroban SDK 22.0.0 and is configured for Stellar testnet deployment. All storage keys are prefixed for organization:

- Products: `"products"`
- Requests: `"requests"`
- Escrows: `"escrows"`
- Proposals: `"proposals"`
- NFTs: `"nfts"`
- Deliveries: `"deliveries"`

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue on GitHub.