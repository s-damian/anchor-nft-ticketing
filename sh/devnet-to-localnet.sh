#!/bin/bash

# Changement de Solana CLI vers Localnet.
solana config set --url localhost

# Remplacer le cluster dans [provider] de "devnet" à "localnet".
sed -i "s/cluster = \"devnet\"/cluster = \"localnet\"/" Anchor.toml

# Mise à jour du fichier .env de l'App Next.js.
ENV_FILE="./app/frontend/.env"
sed -i 's/NEXT_PUBLIC_REACT_APP_SOLANA_NETWORK="devnet"/NEXT_PUBLIC_REACT_APP_SOLANA_NETWORK="localnet"/' "$ENV_FILE"
