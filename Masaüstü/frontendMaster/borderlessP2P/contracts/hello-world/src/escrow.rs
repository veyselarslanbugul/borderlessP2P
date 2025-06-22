#![allow(unused_variables)]
use soroban_sdk::{contracttype, Address, Env, Vec, Symbol};

#[contracttype]
pub struct Escrow {
    pub buyer: Address,
    pub seller: Address,
    pub amount: i128,
}

const ESCROWS_KEY: &str = "escrows";

pub struct Escrows;

impl Escrows {
    pub fn add(env: Env, buyer: Address, seller: Address, amount: i128) {
        let mut escrows: Vec<Escrow> = env.storage().persistent().get(&Symbol::new(&env, ESCROWS_KEY)).unwrap_or(Vec::new(&env));
        let escrow = Escrow { buyer, seller, amount };
        escrows.push_back(escrow);
        env.storage().persistent().set(&Symbol::new(&env, ESCROWS_KEY), &escrows);
    }

    pub fn list(env: Env) -> Vec<Escrow> {
        env.storage().persistent().get(&Symbol::new(&env, ESCROWS_KEY)).unwrap_or(Vec::new(&env))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_add_escrow() {
        let env = Env::default();
        let contract_id = env.register_contract(None, super::super::BorderlessP2P);
        let buyer = Address::generate(&env);
        let seller = Address::generate(&env);
        let amount = 1000i128;
        
        env.as_contract(&contract_id, || {
            Escrows::add(env.clone(), buyer.clone(), seller.clone(), amount);
            let escrows = Escrows::list(env.clone());
            assert_eq!(escrows.len(), 1);
            let escrow = escrows.get(0u32).unwrap();
            assert_eq!(escrow.buyer, buyer);
            assert_eq!(escrow.seller, seller);
            assert_eq!(escrow.amount, amount);
        });
    }

    #[test]
    fn test_list_escrows() {
        let env = Env::default();
        let contract_id = env.register_contract(None, super::super::BorderlessP2P);
        let buyer1 = Address::generate(&env);
        let seller1 = Address::generate(&env);
        let buyer2 = Address::generate(&env);
        let seller2 = Address::generate(&env);
        let amount1 = 1000i128;
        let amount2 = 2000i128;
        
        env.as_contract(&contract_id, || {
            Escrows::add(env.clone(), buyer1.clone(), seller1.clone(), amount1);
            Escrows::add(env.clone(), buyer2.clone(), seller2.clone(), amount2);
            let escrows = Escrows::list(env.clone());
            assert_eq!(escrows.len(), 2);
        });
    }
} 