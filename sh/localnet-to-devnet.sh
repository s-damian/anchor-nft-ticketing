#!/bin/bash

# Changement de Solana CLI vers Devnet.
solana config set --url https://api.devnet.solana.com

# Remplacer le cluster dans [provider] de "localnet" à "devnet".
sed -i "s/cluster = \"localnet\"/cluster = \"devnet\"/" Anchor.toml

# Mise à jour du fichier .env.local de l'App Next.js.
ENV_FILE="./app/front/.env.local"
sed -i 's/NEXT_PUBLIC_REACT_APP_SOLANA_NETWORK="localnet"/NEXT_PUBLIC_REACT_APP_SOLANA_NETWORK="devnet"/' "$ENV_FILE"
