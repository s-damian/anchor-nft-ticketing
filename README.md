
# NFT Ticketing in Solana / Anchor

<a href="https://github.com/s-damian/rust-solana-wallet">
<img src="https://raw.githubusercontent.com/s-damian/medias/main/technos-logos/rust.webp" alt="Rust Logo" height="100px">
</a>
<a href="https://github.com/s-damian/rust-solana-wallet">
<img src="https://raw.githubusercontent.com/s-damian/medias/main/technos-logos/solana.webp" alt="Solana Logo" height="100px">
</a>
<a href="https://github.com/s-damian/rust-solana-wallet">
<img src="https://raw.githubusercontent.com/s-damian/medias/main/technos-logos/anchor.webp" alt="Anchor Logo" height="100px">
</a>

> #Rust #Solana #Anchor #React #NFT # Web3

> NFT Marketplace Event Ticketing (**under development**)


## Project Overview

NFT Marketplace Event Ticketing - A decentralized application for managing and verifying event tickets as NFTs on the Solana blockchain.

**Status**: Under development 🚧


## Prerequisites

- Rust 1.79.0
- Solana 1.18.22
- Anchor 0.30.1


## Technologies Used

- Rust
- Solana
- Anchor 0.30.1
- Solana-Web3.js
- Next.js 14
- React 18
- TypeScript
- Tailwind
- Phantom Wallet


## Clone this project

```bash
git clone https://github.com/s-damian/anchor-nft-ticketing.git
```


## Using Solana Locally

```bash
solana config set --url localhost
```


## Install dependencies

On Anchor Program:

```bash
cd /[your-path]/anchor-nft-ticketing
```

```bash
npm install
```

On Next.js App:

```bash
cd /[your-path]/anchor-nft-ticketing/app/front
```

```bash
npm install
```


## Create your .env file on Next.js App:

```bash
cd /[your-path]/anchor-nft-ticketing/app/front
```

```bash
cp .env.example .env
```



## Solana Test Validator

Run solana-test-validator (with metaplex):

```bash
npm run ledger
```


## Build and Deploy

```bash
anchor build && anchor deploy
```


## IDL

Copy IDL:

```bash
cd /[your-path]/anchor-nft-ticketing
```

```bash
./sh/copy-idl.sh
```


## Change Program ID

In the file :

```bash
target/idl/nft_ticketing.json
```

Find your program ID (with Anchor 0.30.1):

```bash
"address": "[YOUR_PROGRAM_ID]"
```

Then put this program ID in these files:

- ```Anchor.toml``` file:

```bash
nft_ticketing = "[YOUR_PROGRAM_ID]"
```

- ```programs/nft-ticketing/src/lib.rs``` file:

```bash
declare_id!("[YOUR_PROGRAM_ID]");
```

Build and deploy again:

```bash
anchor build && anchor deploy
```


## Run Front-End App (Next.js App):

```bash
cd /[your-path]/anchor-nft-ticketing/app/front
```

```bash
npm run dev
```


## Code Structure

```bash
.
├── app
│   └── front
│       ├── app
│       │   // Pages (Nextjs App Router).
│       ├── src
│       │   ├── components
│       │   │   // React components.
│       │   ├── handlers
│       │   │   // React handlers.
│       │   ├── idl
│       │   │   └── nft_ticketing.json.
│       │   └── utils
│       │       // React utils.
│       ├── .env.local
│       ├── config-overrides.js
│       ├── package.json
│       └── tailwind.config.ts
├── programs
│   └── nft-ticketing
│       ├── src
│       │   ├── kernel
│       │   │   // Program managers.
│       │   └── lib.rs
│       └── Cargo.toml
├── tests
│   └── tests.ts
├── Anchor.toml
├── Cargo.toml
├── package.json
└── README.md
```


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
