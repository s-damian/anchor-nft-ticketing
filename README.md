
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
