# Tickets-Swap

## Groupe 23:
- Stephen Damian ([@s-damian](https://github.com/s-damian))
- Thomas Dupuy ([@Cecile-Hirschauer](https://github.com/Cecile-Hirschauer))
- Cécile Hirschauer ([tomaka7](https://github.com/tomaka7))

## Présentation

Une plateforme pour vendre des billets d'événements (concerts, spectacles, conférences) sous forme de NFT, permettant une vérification facile et sécurisée des billets.

## Techno

- **Anchor** : Framework pour le développement de smart contracts sur Solana.
- **Next.js** : Framework React pour le développement de sites web et d'applications.
- **Web3.js** : Bibliothèque JavaScript pour interagir avec Ethereum et d'autres blockchains compatibles avec EVM.
- **metaplex_metadata_token** : Programme pour la gestion des métadonnées des tokens NFT sur la blockchain Solana.
- **spl-token** : Librairie pour la gestion des tokens sur Solana.
- **Tailwind CSS** : Framework CSS pour la conception de styles rapides et modulaires.
- **Phantom Wallet** : Wallet Solana utilisé pour interagir avec les applications décentralisées.

## Structure du projet

```plaintext
app/
  migrations/
  node_modules/
  programs/
    tickets-swap/
src/
  kernel/
    event_manager.rs
    mod.rs
    nft_manager.rs
    ticket_manager.rs
  lib.rs
  Cargo.toml
  Xargo.toml
sh/
  copy-idl.sh
  test-ledger.sh
target/
tests/
  metaplex_token_metadata_program.so
  tests.ts
.gitignore
.prettierignore
.prettierrc.json
Anchor.toml
Cargo.lock
Cargo.toml
package-lock.json
package.json
README.md
tsconfig.json
```

## Fonctionnalités Principales
- Gestion des Événements
    - **Création d'Événements** :
        - Permet aux utilisateurs de créer des événements avec un titre, une description, une date, un lieu et un prix de billet.
- Gestion des NFTs
    - **Création et mint de NFTs pour les Tickets :**
        - Permet de créer un NFT associé à un ticket, avec un nom, un symbole et une URI.
        - Vérifie l'autorisation du signataire et si le ticket a déjà un NFT.
- Gestion des Tickets
    - **Achat de Tickets :**
        - Permet aux utilisateurs d'acheter des tickets pour des événements.
        - Assigne le ticket à l'acheteur et transfère le montant du ticket à l'organisateur de l'événement.
- Vérification des tickets

## Tests
Pour exécuter les tests, utilisez la commande suivante :

```bash
anchor test --skip-local-validator
```

Résultats des Tests
Création d'un événement et d'un ticket :
```
createEvent - Transaction réussie.
buyTicket - Tentative d'achat de billet avec un propriétaire invalide.
buyTicket - Tentative d'achat de billet réussie.
createNft - Tentative de création d'un NFT réussie.
plaintext

4 passing (3s)
```
## Déploiement
Le programme a été déployé en local et sur un custom RPC Devnet QuickNode :

```
Cluster: https://morning-capable-pool.solana-devnet.quiknode.pro/997457cc66b9130e410f8b30a3200d6d755b77cb/
Upgrade authority: ~/.config/solana/id.json
Program Id: E3Mqfc5uYhQ1V8VCNQpWnx59LXECGYo3fvfvFgxFq1Ah
```
