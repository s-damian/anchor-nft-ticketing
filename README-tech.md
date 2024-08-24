## Back-End Lint

```bash
cd /[your-path]/anchor-nft-ticketing
```

Format the code:

```bash
cargo fmt
```

Lint :

```bash
cargo clippy
```


## Front-End Lint

```bash
cd /[your-path]/anchor-nft-ticketing
```

Lint and format the code :

```bash
npm run lint:fix
```


## Run test with Localnet

```bash
cd /[your-path]/anchor-nft-ticketing
```

```bash
npm run test
```


## Networks

| Name         | Consensus            | Type              | Equivalent on Ethereum      |
|--------------|----------------------|-------------------|-----------------------------|
| **Localnet** | PoS (Proof of Stake) | Local development | Localhost (Hardhat Network) |
| **Devnet**   | PoS (Proof of Stake) | Public devnet     | Sepolia                     |
| **Testnet**  | PoS (Proof of Stake) | Public testnet    | Goerli                      |
| **Mainnet**  | PoS (Proof of Stake) | Production        | Mainnet                     |
