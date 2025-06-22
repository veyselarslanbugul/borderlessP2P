#![allow(unused_variables)]
use soroban_sdk::{contracterror, contracttype, Env, BytesN, Symbol, Address, Vec};

// Data structure to hold delivery proof information
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DeliveryProof {
    pub tx_id: BytesN<32>,
    pub deliverer: Address,
    pub ipfs_hash: BytesN<32>,
}

// Contract errors enum
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum DeliveryError {
    ProofAlreadyExists = 601,
    ProofNotFound = 602,
    InvalidHash = 603,
}

// Delivery storage key prefix
const DELIVERIES_KEY: &str = "deliveries";

// Main struct for delivery module
pub struct Deliveries;

impl Deliveries {
    /// Records delivery proof.
    pub fn add(env: Env, tx_id: BytesN<32>, deliverer: Address, ipfs_hash: BytesN<32>) {
        let mut deliveries: Vec<DeliveryProof> = env.storage().persistent().get(&Symbol::new(&env, DELIVERIES_KEY)).unwrap_or(Vec::new(&env));
        let proof = DeliveryProof { tx_id, deliverer, ipfs_hash };
        deliveries.push_back(proof);
        env.storage().persistent().set(&Symbol::new(&env, DELIVERIES_KEY), &deliveries);
    }

    /// Retrieves delivery proof.
    pub fn list(env: Env) -> Vec<DeliveryProof> {
        env.storage().persistent().get(&Symbol::new(&env, DELIVERIES_KEY)).unwrap_or(Vec::new(&env))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env, BytesN};

    fn sample_tx_id(env: &Env) -> BytesN<32> {
        BytesN::from_array(env, &[1u8; 32])
    }
    
    fn sample_ipfs_hash(env: &Env) -> BytesN<32> {
        BytesN::from_array(env, &[2u8; 32])
    }

    #[test]
    fn test_add_delivery() {
        let env = Env::default();
        let contract_id = env.register_contract(None, super::super::BorderlessP2P);
        let deliverer = Address::generate(&env);
        let tx_id = sample_tx_id(&env);
        let ipfs_hash = sample_ipfs_hash(&env);
        
        env.as_contract(&contract_id, || {
            Deliveries::add(env.clone(), tx_id.clone(), deliverer.clone(), ipfs_hash.clone());
            let deliveries = Deliveries::list(env.clone());
            assert_eq!(deliveries.len(), 1);
            let delivery = deliveries.get(0u32).unwrap();
            assert_eq!(delivery.tx_id, tx_id);
            assert_eq!(delivery.deliverer, deliverer);
            assert_eq!(delivery.ipfs_hash, ipfs_hash);
        });
    }

    #[test]
    fn test_list_deliveries() {
        let env = Env::default();
        let contract_id = env.register_contract(None, super::super::BorderlessP2P);
        let deliverer1 = Address::generate(&env);
        let deliverer2 = Address::generate(&env);
        let tx_id1 = sample_tx_id(&env);
        let tx_id2 = BytesN::from_array(&env, &[3u8; 32]);
        let ipfs_hash1 = sample_ipfs_hash(&env);
        let ipfs_hash2 = BytesN::from_array(&env, &[4u8; 32]);
        
        env.as_contract(&contract_id, || {
            Deliveries::add(env.clone(), tx_id1.clone(), deliverer1.clone(), ipfs_hash1.clone());
            Deliveries::add(env.clone(), tx_id2.clone(), deliverer2.clone(), ipfs_hash2.clone());
            let deliveries = Deliveries::list(env.clone());
            assert_eq!(deliveries.len(), 2);
        });
    }
} 