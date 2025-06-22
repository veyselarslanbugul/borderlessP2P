#![allow(unused_variables)]
use soroban_sdk::{contracttype, Address, Env, BytesN, Vec, Symbol};

// Data structure to hold request information
#[contracttype]
pub struct Request {
    pub requester: Address,
    pub product_title: BytesN<32>,
    pub details: BytesN<64>,
}

// Request storage key prefix
const REQUESTS_KEY: &str = "requests";

// Main struct for requests module
pub struct Requests;

impl Requests {
    /// Creates a new request and records it on the blockchain.
    ///
    /// # Arguments
    /// * `env` - Contract environment.
    /// * `requester` - Address of the buyer opening the request.
    /// * `product_title` - Title of the requested product (maximum 32 bytes).
    /// * `details` - Detailed description (maximum 64 bytes).
    pub fn add(env: Env, requester: Address, product_title: BytesN<32>, details: BytesN<64>) {
        let mut requests: Vec<Request> = env.storage().persistent().get(&Symbol::new(&env, REQUESTS_KEY)).unwrap_or(Vec::new(&env));
        let request = Request { requester, product_title, details };
        requests.push_back(request);
        env.storage().persistent().set(&Symbol::new(&env, REQUESTS_KEY), &requests);
    }

    /// Lists all active requests on the blockchain.
    ///
    /// # Arguments
    /// * `env` - Contract environment.
    ///
    /// # Returns
    /// Returns a `Vec` of all non-expired `Request` structs.
    pub fn list(env: Env) -> Vec<Request> {
        env.storage().persistent().get(&Symbol::new(&env, REQUESTS_KEY)).unwrap_or(Vec::new(&env))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env, BytesN};

    fn sample_title(env: &Env) -> BytesN<32> {
        BytesN::from_array(env, &[1u8; 32])
    }
    
    fn sample_details(env: &Env) -> BytesN<64> {
        BytesN::from_array(env, &[2u8; 64])
    }

    #[test]
    fn test_add_request() {
        let env = Env::default();
        let contract_id = env.register_contract(None, super::super::BorderlessP2P);
        let requester = Address::generate(&env);
        let title = sample_title(&env);
        let details = sample_details(&env);
        
        env.as_contract(&contract_id, || {
            Requests::add(env.clone(), requester.clone(), title.clone(), details.clone());
            let requests = Requests::list(env.clone());
            assert_eq!(requests.len(), 1);
            let request = requests.get(0u32).unwrap();
            assert_eq!(request.requester, requester);
            assert_eq!(request.product_title, title);
            assert_eq!(request.details, details);
        });
    }

    #[test]
    fn test_list_requests() {
        let env = Env::default();
        let contract_id = env.register_contract(None, super::super::BorderlessP2P);
        let requester1 = Address::generate(&env);
        let requester2 = Address::generate(&env);
        let title1 = sample_title(&env);
        let details1 = sample_details(&env);
        let title2 = BytesN::from_array(&env, &[3u8; 32]);
        let details2 = BytesN::from_array(&env, &[4u8; 64]);
        
        env.as_contract(&contract_id, || {
            Requests::add(env.clone(), requester1.clone(), title1.clone(), details1.clone());
            Requests::add(env.clone(), requester2.clone(), title2.clone(), details2.clone());
            let requests = Requests::list(env.clone());
            assert_eq!(requests.len(), 2);
        });
    }
} 