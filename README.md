
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


## Prerequisites

Install Rust, Solana, Anchor on your computer.


## Technologies

* Rust
* Solana
* Anchor 0.29.0
* Solana-Web3.js
* Phantom Wallet
* Next.js 14
* React 18
* TypeScript 5
* Tailwind


## Clone this project

```
git clone https://github.com/s-damian/anchor-nft-ticketing.git

```


## Using Solana Locally

```
solana config set --url localhost
```


## Install dependencies

On Anchor Program:

```
cd /[your-path]/anchor-nft-ticketing
```

```
npm install
```

On Next.js App:

```
cd /[your-path]/anchor-nft-ticketing/app/front
```

```
npm install
```


## Create your .env file on Next.js App:

```
cd /[your-path]/anchor-nft-ticketing/app/front
```

```
cp .env.example .env
```



## Solana Test Validator

Run solana-test-validator (with metaplex):

```
npm run ledger
```


## Build and Deploy

```
anchor build && anchor deploy
```


## IDL

Copy IDL:

```
cd /[your-path]/anchor-nft-ticketing
```

```
./sh/copy-idl.sh
```


## Change program ID

In the file :

```
target/idl/nft_ticketing.json
```

Find your program ID (with Anchor 0.29.0):

```
"metadata": {
    "address": "[YOUR_PROGRAM_ID]"
}
```

Then put this program ID in these files:

- ```Anchor.toml``` file:

```
nft_ticketing = "[YOUR_PROGRAM_ID]"
```

- ```programs/nft-ticketing/src/lib.rs``` file:

```
declare_id!("[YOUR_PROGRAM_ID]");
```

Build and deploy again:
```
anchor build && anchor deploy
```


## Run Front-End App (Next.js App):

```
cd /[your-path]/anchor-nft-ticketing/app/front
```

```
npm run dev
```
