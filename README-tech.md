## Networks

| Name         | Consensus            | Type              | Equivalent on Ethereum      |
|--------------|----------------------|-------------------|-----------------------------|
| **Localnet** | PoS (Proof of Stake) | Local development | Localhost (Hardhat Network) |
| **Devnet**   | PoS (Proof of Stake) | Public devnet     | Sepolia                     |
| **Testnet**  | PoS (Proof of Stake) | Public testnet    | Goerli                      |
| **Mainnet**  | PoS (Proof of Stake) | Production        | Mainnet                     |



## Commitment Levels

| **Option**    | **Description** |
|---------------|---|
| **processed** | The transaction has been seen by a validator and processed by that validator, but it hasn't yet been confirmed by the network. It could still be canceled or modified. |
| **confirmed** | The transaction has been included in a block that has been voted on by at least one validator, but it could still be reorganized in the event of a minor chain fork. |
| **finalized** | The transaction has been included in a block that has reached a high level of confirmation, making it extremely unlikely to be canceled, except in the event of a major chain fork. |



## Run tests (Localnet)

```bash
cd /<your-path>/anchor-nft-ticketing
```

When the Solana local validator is not activated (without `--skip-local-validator` argument):

```bash
anchor test
```

When the Solana local validator is activated (must add argument `--skip-local-validator`):

```bash
anchor test --skip-local-validator
```



## Lint

### Rust Lint

```bash
cd /<your-path>/anchor-nft-ticketing
```

Format the code:

```bash
cargo fmt
```

Lint :

```bash
cargo clippy
```

### JS Lint

```bash
cd /<your-path>/anchor-nft-ticketing
```

Lint and format the code :

```bash
npm run lint:fix
```
