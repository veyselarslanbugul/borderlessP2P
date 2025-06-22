#![allow(unused_variables)]
use soroban_sdk::{contracttype, Address, Env, Vec, Symbol};

#[contracttype]
pub struct Nft {
    pub owner: Address,
    pub score: i128,
}

const NFTS_KEY: &str = "nfts";

pub struct Nfts;

impl Nfts {
    pub fn mint(env: Env, owner: Address, score: i128) {
        let mut nfts: Vec<Nft> = env.storage().persistent().get(&Symbol::new(&env, NFTS_KEY)).unwrap_or(Vec::new(&env));
        let nft = Nft { owner, score };
        nfts.push_back(nft);
        env.storage().persistent().set(&Symbol::new(&env, NFTS_KEY), &nfts);
    }

    pub fn list(env: Env) -> Vec<Nft> {
        env.storage().persistent().get(&Symbol::new(&env, NFTS_KEY)).unwrap_or(Vec::new(&env))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_mint_nft() {
        let env = Env::default();
        let contract_id = env.register_contract(None, super::super::BorderlessP2P);
        let owner = Address::generate(&env);
        let score = 100i128;
        
        env.as_contract(&contract_id, || {
            Nfts::mint(env.clone(), owner.clone(), score);
            let nfts = Nfts::list(env.clone());
            assert_eq!(nfts.len(), 1);
            let nft = nfts.get(0u32).unwrap();
            assert_eq!(nft.owner, owner);
            assert_eq!(nft.score, score);
        });
    }

    #[test]
    fn test_list_nfts() {
        let env = Env::default();
        let contract_id = env.register_contract(None, super::super::BorderlessP2P);
        let owner1 = Address::generate(&env);
        let owner2 = Address::generate(&env);
        let score1 = 100i128;
        let score2 = 200i128;
        
        env.as_contract(&contract_id, || {
            Nfts::mint(env.clone(), owner1.clone(), score1);
            Nfts::mint(env.clone(), owner2.clone(), score2);
            let nfts = Nfts::list(env.clone());
            assert_eq!(nfts.len(), 2);
        });
    }
} 