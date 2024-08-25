#!/bin/bash

# Liste des programmes.
PROGRAMS=("nft_ticketing")

# Parcourir chaque programme.
for PROGRAM in "${PROGRAMS[@]}"; do
  # Obtenez le nouveau Program ID.
  PROGRAM_ID=$(solana address -k target/deploy/${PROGRAM}-keypair.json)
  # Convertir le nom du programme pour le chemin du fichier (remplacer _ par -).
  PROGRAM_PATH=${PROGRAM//_/-}

  # Mise à jour de Anchor.toml pour chaque programme
  sed -i "s/${PROGRAM} = \"[^\"]*\"/${PROGRAM} = \"$PROGRAM_ID\"/" Anchor.toml

  # Mise à jour de lib.rs pour chaque programme
  sed -i "s/declare_id!(\"[^\"]*\")/declare_id!(\"$PROGRAM_ID\")/" programs/${PROGRAM_PATH}/src/lib.rs

  echo "Program ID for ${PROGRAM} (path: ${PROGRAM_PATH}) updated to $PROGRAM_ID in Anchor.toml and lib.rs."
done
