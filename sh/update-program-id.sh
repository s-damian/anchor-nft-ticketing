#!/bin/bash

# Obtenez le nouveau Program ID
PROGRAM_ID=$(solana address -k target/deploy/nft_ticketing-keypair.json)

# Mise à jour de Anchor.toml
sed -i "s/nft_ticketing = \"[^\"]*\"/nft_ticketing = \"$PROGRAM_ID\"/" Anchor.toml

# Mise à jour de lib.rs
sed -i "s/declare_id!(\"[^\"]*\")/declare_id!(\"$PROGRAM_ID\")/" programs/nft-ticketing/src/lib.rs

echo "Program ID updated to $PROGRAM_ID in Anchor.toml and lib.rs."
