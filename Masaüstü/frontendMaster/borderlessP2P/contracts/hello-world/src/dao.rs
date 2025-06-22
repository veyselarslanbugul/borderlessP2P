use soroban_sdk::{contracttype, Address, Env, Vec, Symbol};

#[contracttype]
pub struct Proposal {
    pub proposer: Address,
    pub description: Symbol,
}

const PROPOSALS_KEY: &str = "proposals";

pub struct Dao;

impl Dao {
    pub fn add(env: Env, proposer: Address, description: Symbol) {
        let mut proposals: Vec<Proposal> = env.storage().persistent().get(&Symbol::new(&env, PROPOSALS_KEY)).unwrap_or(Vec::new(&env));
        let proposal = Proposal { proposer, description };
        proposals.push_back(proposal);
        env.storage().persistent().set(&Symbol::new(&env, PROPOSALS_KEY), &proposals);
    }

    pub fn list(env: Env) -> Vec<Proposal> {
        env.storage().persistent().get(&Symbol::new(&env, PROPOSALS_KEY)).unwrap_or(Vec::new(&env))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_add_proposal() {
        let env = Env::default();
        let contract_id = env.register_contract(None, super::super::BorderlessP2P);
        let proposer = Address::generate(&env);
        let description = Symbol::new(&env, "test");
        
        env.as_contract(&contract_id, || {
            Dao::add(env.clone(), proposer.clone(), description.clone());
            let proposals = Dao::list(env.clone());
            assert_eq!(proposals.len(), 1);
            let proposal = proposals.get(0u32).unwrap();
            assert_eq!(proposal.proposer, proposer);
            assert_eq!(proposal.description, description);
        });
    }

    #[test]
    fn test_list_proposals() {
        let env = Env::default();
        let contract_id = env.register_contract(None, super::super::BorderlessP2P);
        let proposer1 = Address::generate(&env);
        let proposer2 = Address::generate(&env);
        let description1 = Symbol::new(&env, "p1");
        let description2 = Symbol::new(&env, "p2");
        
        env.as_contract(&contract_id, || {
            Dao::add(env.clone(), proposer1.clone(), description1.clone());
            Dao::add(env.clone(), proposer2.clone(), description2.clone());
            let proposals = Dao::list(env.clone());
            assert_eq!(proposals.len(), 2);
        });
    }
} 