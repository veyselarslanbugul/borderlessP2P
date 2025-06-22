#![no_std] // Don't use Rust's standard library (required for blockchain contracts)

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Vec, Symbol, BytesN};

// Import all modules
pub mod product;
pub mod requests;
pub mod escrow;
pub mod dao;
pub mod nft;
pub mod delivery;

#[contract]
pub struct BorderlessP2P;

#[contractimpl]
impl BorderlessP2P {
    // Product functions
    pub fn add_product(env: Env, seller: Address, title: BytesN<32>, desc: BytesN<64>, price: i128) {
        product::Products::add(env, seller, title, desc, price);
    }

    pub fn list_products(env: Env) -> Vec<product::Product> {
        product::Products::list(env)
    }

    // Request functions
    pub fn add_request(env: Env, requester: Address, product_title: BytesN<32>, details: BytesN<64>) {
        requests::Requests::add(env, requester, product_title, details);
    }

    pub fn list_requests(env: Env) -> Vec<requests::Request> {
        requests::Requests::list(env)
    }

    // Escrow functions
    pub fn add_escrow(env: Env, buyer: Address, seller: Address, amount: i128) {
        escrow::Escrows::add(env, buyer, seller, amount);
    }

    pub fn list_escrows(env: Env) -> Vec<escrow::Escrow> {
        escrow::Escrows::list(env)
    }

    // DAO functions
    pub fn add_proposal(env: Env, proposer: Address, description: Symbol) {
        dao::Dao::add(env, proposer, description);
    }

    pub fn list_proposals(env: Env) -> Vec<dao::Proposal> {
        dao::Dao::list(env)
    }

    // NFT functions
    pub fn mint_nft(env: Env, owner: Address, score: i128) {
        nft::Nfts::mint(env, owner, score);
    }

    pub fn list_nfts(env: Env) -> Vec<nft::Nft> {
        nft::Nfts::list(env)
    }

    // Delivery functions
    pub fn add_delivery(env: Env, tx_id: BytesN<32>, deliverer: Address, ipfs_hash: BytesN<32>) {
        delivery::Deliveries::add(env, tx_id, deliverer, ipfs_hash);
    }

    pub fn list_deliveries(env: Env) -> Vec<delivery::DeliveryProof> {
        delivery::Deliveries::list(env)
    }
}