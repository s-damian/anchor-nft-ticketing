#!/bin/bash

# Chemins des fichiers IDL
SRC_IDL="target/idl/tickets_swap.json"
DEST_IDL="app/tickets-swap/src/idl/tickets_swap.json"

# Copie le fichier IDL
cp $SRC_IDL $DEST_IDL

echo "IDL copied from $SRC_IDL to $DEST_IDL"
