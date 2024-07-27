#!/bin/bash

# Chemins des fichiers IDL
SRC_IDL="target/idl/anchor_nft_ticketing.json"
DEST_IDL="app/front/src/idl/anchor_nft_ticketing.json"

# Copie le fichier IDL
cp $SRC_IDL $DEST_IDL

echo "IDL copied from $SRC_IDL to $DEST_IDL"
