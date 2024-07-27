
# Anchor NFT Ticketing


## Prerequisites

Install Rust, Solana, etc.


## Clone this project

```
git clone https://github.com/s-damian/anchor-nft-ticketing.git

```


## Using Solana Locally

```
solana config set --url localhost
```


## Install deps

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


## Create your .env file

```
cd /[your-path]/anchor-nft-ticketing
```

```
cp app/front/.env.example app/front/.env
```



## Solana Test Validator

Run solana-test-validator (with metaplex):

```
npm run ledger
```


## Build and Deploy

Build:

```
anchor build
```

Deploy:

```
anchor deploy
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

Dans le fichier :

```
target/idl/anchor_nft_ticketing.json
```

Chercher votre program ID :

```
"metadata": {
    "address": "[YOUR_PROGRAM_ID]"
}
```

Puis mettez ce program ID dans ces fichier :

```Anchor.toml``` file:

```
tickets_swap = "[YOUR_PROGRAM_ID]"
```

```programs/tickets-swap/src/lib.rs``` file:

```
declare_id!("[YOUR_PROGRAM_ID]");
```


## Run Front-End App (Next.js App):

```
cd /[your-path]/anchor-nft-ticketing/app/front
```

```
npm run dev
```
