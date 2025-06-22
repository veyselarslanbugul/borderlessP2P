#![allow(unused_variables)] // Disable unused variable warnings for now
use soroban_sdk::{contracttype, Address, Env, BytesN, Vec, Symbol};

// Data structure to hold product information
#[contracttype]
pub struct Product {
    pub seller: Address,
    pub title: BytesN<32>, // Short texts (e.g., "Laptop")
    pub desc: BytesN<64>,  // Longer descriptions (e.g., "8 GB RAM, 256 GB SSD")
    pub price: i128,       // Product price
}

// Product storage key prefix
const PRODUCTS_KEY: &str = "products";

// Main struct for products module
pub struct Products;

impl Products {
    /// Creates a new product and records it on the blockchain.
    ///
    /// # Arguments
    /// * `env` - Contract environment.
    /// * `seller` - Address of the person selling the product.
    /// * `title` - Product title (maximum 32 bytes).
    /// * `desc` - Product description (maximum 64 bytes).
    /// * `price` - Product price (i128 type).
    pub fn add(env: Env, seller: Address, title: BytesN<32>, desc: BytesN<64>, price: i128) {
        let mut products: Vec<Product> = env.storage().persistent().get(&Symbol::new(&env, PRODUCTS_KEY)).unwrap_or(Vec::new(&env));
        let product = Product { seller, title, desc, price };
        products.push_back(product);
        env.storage().persistent().set(&Symbol::new(&env, PRODUCTS_KEY), &products);
    }

    /// Lists all products on the blockchain.
    ///
    /// # Arguments
    /// * `env` - Contract environment.
    ///
    /// # Returns
    /// Returns a `Vec` of all `Product` structs on the blockchain.
    pub fn list(env: Env) -> Vec<Product> {
        env.storage().persistent().get(&Symbol::new(&env, PRODUCTS_KEY)).unwrap_or(Vec::new(&env))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env, BytesN};

    fn sample_title(env: &Env) -> BytesN<32> {
        BytesN::from_array(env, &[1u8; 32])
    }
    
    fn sample_desc(env: &Env) -> BytesN<64> {
        BytesN::from_array(env, &[2u8; 64])
    }

    #[test]
    fn test_add_product() {
        let env = Env::default();
        let contract_id = env.register_contract(None, super::super::BorderlessP2P);
        let seller = Address::generate(&env);
        let title = sample_title(&env);
        let desc = sample_desc(&env);
        let price = 1000i128;
        
        env.as_contract(&contract_id, || {
            Products::add(env.clone(), seller.clone(), title.clone(), desc.clone(), price);
            let products = Products::list(env.clone());
            assert_eq!(products.len(), 1);
            let product = products.get(0u32).unwrap();
            assert_eq!(product.seller, seller);
            assert_eq!(product.title, title);
            assert_eq!(product.desc, desc);
            assert_eq!(product.price, price);
        });
    }

    #[test]
    fn test_list_products() {
        let env = Env::default();
        let contract_id = env.register_contract(None, super::super::BorderlessP2P);
        let seller1 = Address::generate(&env);
        let seller2 = Address::generate(&env);
        let title1 = sample_title(&env);
        let desc1 = sample_desc(&env);
        let title2 = BytesN::from_array(&env, &[3u8; 32]);
        let desc2 = BytesN::from_array(&env, &[4u8; 64]);
        let price1 = 1000i128;
        let price2 = 2000i128;
        
        env.as_contract(&contract_id, || {
            Products::add(env.clone(), seller1.clone(), title1.clone(), desc1.clone(), price1);
            Products::add(env.clone(), seller2.clone(), title2.clone(), desc2.clone(), price2);
            let products = Products::list(env.clone());
            assert_eq!(products.len(), 2);
        });
    }
}