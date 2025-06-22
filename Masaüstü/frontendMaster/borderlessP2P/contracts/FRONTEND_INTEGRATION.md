# Frontend Integration Guide - BorderlessP2P

This guide provides all the information a frontend developer needs to integrate with the BorderlessP2P smart contract on Stellar.

## 📋 Contract Information

- **Contract ID**: `CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO`
- **Network**: Stellar Testnet
- **SDK Version**: Soroban SDK 22.0.0
- **Repository**: [https://github.com/MekanCelebi/PeerZone.git](https://github.com/MekanCelebi/PeerZone.git)

## 🚀 Available Functions

### Product Management
```javascript
// Add a new product
add_product(seller: Address, title: BytesN<32>, desc: BytesN<64>, price: i128)

// List all products
list_products() -> Vec<Product>
```

### Request System
```javascript
// Add a new request
add_request(requester: Address, product_title: BytesN<32>, details: BytesN<64>)

// List all requests
list_requests() -> Vec<Request>
```

### Escrow System
```javascript
// Create escrow
add_escrow(buyer: Address, seller: Address, amount: i128)

// List all escrows
list_escrows() -> Vec<Escrow>
```

### DAO Governance
```javascript
// Add proposal
add_proposal(proposer: Address, description: Symbol)

// List proposals
list_proposals() -> Vec<Proposal>
```

### NFT System
```javascript
// Mint NFT
mint_nft(owner: Address, score: i128)

// List NFTs
list_nfts() -> Vec<Nft>
```

### Delivery Proofs
```javascript
// Add delivery proof
add_delivery(tx_id: BytesN<32>, deliverer: Address, ipfs_hash: BytesN<32>)

// List deliveries
list_deliveries() -> Vec<DeliveryProof>
```

## 📊 Data Structures

### Product
```rust
pub struct Product {
    pub seller: Address,
    pub title: BytesN<32>,    // Short texts (e.g., "Laptop")
    pub desc: BytesN<64>,     // Longer descriptions (e.g., "8 GB RAM, 256 GB SSD")
    pub price: i128,          // Product price
}
```

### Request
```rust
pub struct Request {
    pub requester: Address,
    pub product_title: BytesN<32>,
    pub details: BytesN<64>,
}
```

### Escrow
```rust
pub struct Escrow {
    pub buyer: Address,
    pub seller: Address,
    pub amount: i128,
}
```

### Proposal
```rust
pub struct Proposal {
    pub proposer: Address,
    pub description: Symbol,
}
```

### Nft
```rust
pub struct Nft {
    pub owner: Address,
    pub score: i128,
}
```

### DeliveryProof
```rust
pub struct DeliveryProof {
    pub tx_id: BytesN<32>,
    pub deliverer: Address,
    pub ipfs_hash: BytesN<32>,
}
```

## 🔧 Frontend Integration Steps

### 1. Install Dependencies

```bash
# For React/Next.js
npm install @stellar/stellar-sdk
npm install @soroban-react/core
npm install @soroban-react/chains

# For Vue.js
npm install @stellar/stellar-sdk
npm install @soroban-react/core
npm install @soroban-react/chains
```

### 2. Configure Soroban Client

```javascript
import { SorobanRpc, Networks } from '@stellar/stellar-sdk';

const sorobanClient = new SorobanRpc.Server(
  'https://soroban-testnet.stellar.org',
  { allowHttp: true }
);

const network = Networks.TESTNET;
const contractId = 'CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO';
```

### 3. Connect Wallet

```javascript
// Using Soroban React
import { SorobanReactProvider } from '@soroban-react/core';
import { freighter } from '@soroban-react/chains';

const chains = [freighter];

function App() {
  return (
    <SorobanReactProvider chains={chains}>
      <YourApp />
    </SorobanReactProvider>
  );
}
```

### 4. Contract Interaction Examples

#### Add Product
```javascript
import { SorobanRpc, xdr } from '@stellar/stellar-sdk';

async function addProduct(seller, title, desc, price) {
  const source = await server.getAccount(seller.publicKey());
  
  const transaction = new TransactionBuilder(source, {
    fee: "100",
    networkPassphrase: Networks.TESTNET
  })
  .addOperation(InvokeHostFunction({
    hostFunction: xdr.HostFunction.hostFunctionTypeInvokeContract(),
    auth: [],
    args: [
      xdr.ScVal.scvAddress(seller.publicKey()),
      xdr.ScVal.scvBytes(xdr.ScBytes.fromString(title)),
      xdr.ScVal.scvBytes(xdr.ScBytes.fromString(desc)),
      xdr.ScVal.scvI128(xdr.Int128Parts.fromString(price.toString()))
    ]
  }))
  .setTimeout(30)
  .build();

  const signedTx = await seller.signTransaction(transaction);
  const result = await server.sendTransaction(signedTx);
  
  return result;
}
```

#### List Products
```javascript
async function listProducts() {
  const result = await server.simulateTransaction({
    resourceConfig: {
      instructionLeeway: 1000000
    },
    operations: [
      {
        invokeHostFunction: {
          hostFunction: xdr.HostFunction.hostFunctionTypeInvokeContract(),
          auth: [],
          args: []
        }
      }
    ]
  });
  
  return result.result.retval;
}
```

## 🎨 UI Components Examples

### Product Card Component
```jsx
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h3>{product.title}</h3>
      <p>{product.desc}</p>
      <p>Price: {product.price} XLM</p>
      <p>Seller: {product.seller}</p>
      <button onClick={() => buyProduct(product)}>Buy</button>
    </div>
  );
}
```

### Add Product Form
```jsx
function AddProductForm() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProduct(wallet.publicKey, title, desc, parseInt(price));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Product Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={32}
      />
      <textarea
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        maxLength={64}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit">Add Product</button>
    </form>
  );
}
```

## 🔐 Security Considerations

### Input Validation
- Validate all user inputs before sending to contract
- Check string lengths (title: 32 bytes, desc: 64 bytes)
- Validate price is positive integer
- Sanitize addresses

### Error Handling
```javascript
try {
  const result = await contractCall();
  // Handle success
} catch (error) {
  if (error.message.includes('insufficient balance')) {
    // Handle insufficient balance
  } else if (error.message.includes('invalid address')) {
    // Handle invalid address
  } else {
    // Handle other errors
  }
}
```

### Transaction Confirmation
```javascript
async function waitForTransaction(hash) {
  let attempts = 0;
  while (attempts < 30) {
    try {
      const response = await server.getTransaction(hash);
      if (response.status === 'SUCCESS') {
        return response;
      }
    } catch (error) {
      // Transaction not found yet
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }
  throw new Error('Transaction timeout');
}
```

## 📱 Mobile Considerations

### Responsive Design
- Ensure forms work well on mobile devices
- Use appropriate input types (tel, email, etc.)
- Implement touch-friendly buttons and interactions

### Performance
- Implement loading states for all contract calls
- Cache contract data where appropriate
- Use pagination for large lists

## 🧪 Testing

### Unit Tests
```javascript
describe('Product Management', () => {
  it('should add a product successfully', async () => {
    const mockProduct = {
      seller: 'G...',
      title: 'Test Product',
      desc: 'Test Description',
      price: 100
    };
    
    const result = await addProduct(mockProduct);
    expect(result.status).toBe('SUCCESS');
  });
});
```

### Integration Tests
```javascript
describe('Contract Integration', () => {
  it('should list products after adding', async () => {
    await addProduct(testProduct);
    const products = await listProducts();
    expect(products).toContain(testProduct);
  });
});
```

## 🔗 Useful Links

- [Stellar Developer Documentation](https://developers.stellar.org)
- [Soroban Documentation](https://soroban.stellar.org)
- [Soroban React](https://github.com/stellar/soroban-react)
- [Contract Explorer](https://stellar.expert/explorer/testnet/contract/CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO)

## 📞 Support

For technical support or questions:
1. Check the [GitHub repository](https://github.com/MekanCelebi/PeerZone)
2. Review the contract source code in `contracts/hello-world/src/`
3. Test with the provided CLI examples in `DEPLOYMENT.md`

---

**Note**: This contract is deployed on Stellar Testnet. For production use, additional security measures and testing are required. 