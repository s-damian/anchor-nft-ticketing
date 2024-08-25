## Networks

| Name         | Consensus            | Type              | Equivalent on Ethereum      |
|--------------|----------------------|-------------------|-----------------------------|
| **Localnet** | PoS (Proof of Stake) | Local development | Localhost (Hardhat Network) |
| **Devnet**   | PoS (Proof of Stake) | Public devnet     | Sepolia                     |
| **Testnet**  | PoS (Proof of Stake) | Public testnet    | Goerli                      |
| **Mainnet**  | PoS (Proof of Stake) | Production        | Mainnet                     |



## Solana Commitment Levels

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



## Localnet to Devnet

### Switch to Devnet

Change your Solana CLI to use the Devnet:

```bash
solana config set --url https://api.devnet.solana.com
```

### Fund Your Wallet

Airdrop SOL to your Devnet wallet:

```bash
solana airdrop <amout>
```

### Update Anchor Configuration

Modify your `Anchor.toml` file:

#### Anchor.toml - [programs.devnet]

Add :

```bash
[programs.devnet]
nft_ticketing = "<your-program-id>"
```

#### Anchor.toml - [provider]

And replace:

```bash
[provider]
cluster = "localnet"
```

By:

```bash
[provider]
cluster = "devnet"
```

### Environment Variables

In  `/app/front/.env` (Next.js App):
Replace:
```bash
NEXT_PUBLIC_REACT_APP_SOLANA_NETWORK="localnet"
```
By:
```bash
NEXT_PUBLIC_REACT_APP_SOLANA_NETWORK="devnet"
```

### Phantom Wallet

In your Phantom settings, switch **Solana Localnet** to **Solana Devnet**.

### Build and Deploy the Anchor Program

Build:

```bash
anchor build
```

Deploy on the Devnet:

```bash
anchor deploy --provider.cluster devnet
```
### Update Program ID

Automatically update the Program ID in the necessary files:

```bash
npm run update-program-id
```

// anchor build && anchor deploy ???

### IDL Setup

Copy the IDL (Interface Definition Language) file into the Next.js App:

```bash
npm run copy-idl
```

### Run Front-End (Next.js App)

Go to the Next.js App Directory:

```bash
cd /<your-path>/anchor-nft-ticketing/app/front
```

Start the development server:

```bash
npm run dev
```
