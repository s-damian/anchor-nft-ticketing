# Localnet to Devnet - Solana / Anchor

## Preparing for Public Deployment: Transition from Localnet to Solana Devnet

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


#### - In [programs.devnet] section:

Add or update:

```bash
[programs.devnet]
nft_ticketing = "<your-program-id>"
```

#### - In [provider] section:

Replace:

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

In  `./app/front/.env` (Next.js App):

Replace:

```bash
NEXT_PUBLIC_REACT_APP_SOLANA_NETWORK="localnet"
```

By:

```bash
NEXT_PUBLIC_REACT_APP_SOLANA_NETWORK="devnet"
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


### Phantom Wallet

In your Phantom wallet settings, switch to **Solana Devnet**.


### Run Front-End (Next.js App)

Go to the Next.js App Directory:

```bash
cd /<your-path>/anchor-nft-ticketing/app/front
```

Start the development server:

```bash
npm run dev
```

And you can go to the URL:

```bash
http://localhost:3000
```
