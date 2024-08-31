# Local to Devnet - Solana / Anchor

## Preparing for Public Deployment: Transition from Localnet to Solana Devnet

### Switch to Devnet

Change your Solana CLI to use the Devnet:

```bash
solana config set --url https://api.devnet.solana.com
```


### Update Anchor Configuration

Modify your `Anchor.toml` file:

- In `[provider]` section, update to:

```bash
[provider]
cluster = "devnet"
```

- In `[programs.devnet]` section, add or update:

```bash
[programs.devnet]
nft_ticketing = "<your-program-id>"
```


### Environment Variables

Modify your `./app/frontend/.env` file (for the Next.js App):

- Update to:

```bash
NEXT_PUBLIC_REACT_APP_SOLANA_NETWORK="devnet"
```


### Fund Your Wallet

Airdrop SOL to your Devnet wallet:

```bash
solana airdrop <amount>
```


### Go to the Anchor Directory

```bash
cd /<your-path>/anchor-nft-ticketing
```


### Build and Deploy the Anchor Program

Build:

```bash
anchor build
```

Deploy on the Devnet:

```bash
anchor deploy --provider.cluster devnet
```

#### If the Program ID changed during deployment:

> If the Program ID changed during deployment, you must update the references to the Program ID in your configuration files.

- Update Program ID:

```bash
npm run update-program-id
```

- Rebuild and Redeploy the Anchor Program:

```bash
anchor build && anchor deploy --provider.cluster devnet
```


### Phantom Wallet

In your Phantom wallet settings, switch to **Solana Devnet**.


### Run Front-End (Next.js App)

Go to the Next.js App Directory:

```bash
cd /<your-path>/anchor-nft-ticketing/app/frontend
```

Start the development server:

```bash
npm run dev
```

Open your browser and go to:

```bash
http://localhost:3000
```
