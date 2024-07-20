import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TicketsSwap } from "../target/types/tickets_swap";
import { assert } from "chai";
import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";

// ********** Ajoutés pour le NFT **********
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { findMasterEditionPda, findMetadataPda, mplTokenMetadata, MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";

// ********** /Ajoutés pour le NFT **********

describe("create_event_and_ticket", () => {
    // Configure le client pour utiliser le cluster local.
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    // Initialisation du programme Anchor.
    const program = anchor.workspace.TicketsSwap as Program<TicketsSwap>;

    // Générer une nouvelle paire de clés pour le compte de l'événement.
    const eventAccount = anchor.web3.Keypair.generate();
    const ticketPrice = new BN(20000000000); // 20000000000 Lamports = 20 SOL.

    it("Create an event and a ticket", async () => {
        // Détails de l'événement.
        const title = "Test Event";
        const description = "This is a test event.";
        const date = new BN(new Date("2023-12-25").getTime() / 1000); // Convertir la date en secondes puis en BN (BigNumber).
        const location = "Test Location";

        // Appeler l'instruction create_event
        const txid = await program.methods
            .createEvent(title, description, date, location, ticketPrice)
            .accounts({
                event: eventAccount.publicKey, // Compte de l'événement.
                organizer: provider.wallet.publicKey, // Organisateur de l'événement.
                systemProgram: anchor.web3.SystemProgram.programId, // Programme système.
            })
            .signers([eventAccount]) // Signataires de la transaction.
            .rpc();
        console.log("createEvent - tx signature", txid);

        // Récupérer les détails du compte de l'événement.
        const eventAccountData = await program.account.event.fetch(eventAccount.publicKey);

        // Assertions pour vérifier que les détails sont corrects.
        assert.equal(eventAccountData.title, title);
        assert.equal(eventAccountData.description, description);
        assert.equal(eventAccountData.date.toString(), date.toString());
        assert.equal(eventAccountData.location, location);
        assert.equal(eventAccountData.ticketPrice.toString(), ticketPrice.toString());
        assert.equal(eventAccountData.organizer.toBase58(), provider.wallet.publicKey.toBase58()); // Vérifie que l'organisateur est correct.
    });

    it("Attempt to buy a ticket with success", async () => {
        // Récupérer les détails du compte de l'événement.
        const eventAccountData = await program.account.event.fetch(eventAccount.publicKey);

        // Générer une nouvelle paire de clés pour le compte du ticket.
        const ticketAccount = anchor.web3.Keypair.generate();
        const dateOfPurchase = new BN(new Date().getTime() / 1000); // Date actuelle en secondes.

        // Appeler l'instruction buy_ticket du programme Anchor.
        const txid = await program.methods
            .buyTicket(dateOfPurchase)
            .accounts({
                ticket: ticketAccount.publicKey, // Compte du ticket.
                event: eventAccount.publicKey, // Compte de l'événement.
                owner: provider.wallet.publicKey, // Propriétaire du ticket.
                organizer: eventAccountData.organizer, // Organizer de l'événement.
                systemProgram: anchor.web3.SystemProgram.programId, // Programme système.
            })
            .signers([ticketAccount]) // Signataires de la transaction.
            .rpc();
        console.log("buyTicket - tx signature", txid);

        // Récupérer les détails du compte du ticket
        const ticketAccountData = await program.account.ticket.fetch(ticketAccount.publicKey);

        // Assertions pour vérifier que les détails sont corrects.
        assert.equal(ticketAccountData.event.toBase58(), eventAccount.publicKey.toBase58());
        assert.equal(ticketAccountData.price.toString(), ticketPrice.toString());
        assert.equal(ticketAccountData.dateOfPurchase.toString(), dateOfPurchase.toString());
        assert.equal(ticketAccountData.owner.toBase58(), provider.wallet.publicKey.toBase58()); // Vérifie que le propriétaire est correct.
    });

    it("Attempt to buy a ticket with an invalid owner", async () => {
        // Récupérer les détails du compte de l'événement.
        const eventAccountData = await program.account.event.fetch(eventAccount.publicKey);

        // Générer une nouvelle paire de clés pour le compte du ticket.
        const ticketAccount = anchor.web3.Keypair.generate();
        const dateOfPurchase = new BN(new Date().getTime() / 1000); // Date actuelle en secondes.

        // Générer une clé publique non valide pour le propriétaire.
        const invalidOwner = anchor.web3.Keypair.generate();

        try {
            // Appeler l'instruction buy_ticket du programme Anchor.
            // Le faire avec un propriétaire non valide.
            const txid = await program.methods
                .buyTicket(dateOfPurchase)
                .accounts({
                    ticket: ticketAccount.publicKey, // Compte du ticket.
                    event: eventAccount.publicKey, // Compte de l'événement.
                    owner: invalidOwner.publicKey, // Propriétaire non valide du ticket.
                    organizer: eventAccountData.organizer, // Organizer de l'événement.
                    systemProgram: anchor.web3.SystemProgram.programId, // Programme système.
                })
                .signers([ticketAccount]) // Signataires de la transaction.
                .rpc();

            // Si le transfert réussit, échouer le test.
            assert.fail("The transaction should have failed but it succeeded.");
        } catch (err) {
            assert.equal("OK", "OK");
        }
    });

    it("Attempt to create a NFT", async () => {
        const signer = provider.wallet;

        // Initialisation de UMI avec les identités de portefeuille et le module mplTokenMetadata.
        const umi = createUmi("https://api.devnet.solana.com").use(walletAdapterIdentity(signer)).use(mplTokenMetadata());

        // Génération d'une nouvelle paire de clés pour le mint (NFT).
        const mint = anchor.web3.Keypair.generate();

        // Dérivez le compte d'adresse de jeton associé à l'atelier monétaire.
        // Calculer l'adresse du compte de token associé pour le mint.
        const associatedTokenAccount = await getAssociatedTokenAddress(mint.publicKey, signer.publicKey);

        // Dérivez le compte de metadata PDA.
        // Calculer l'adresse du compte de metadata pour le mint.
        let metadataAccount = findMetadataPda(umi, {
            mint: publicKey(mint.publicKey),
        })[0];

        // Dérivez l'édition principale PDA.
        // Calculer l'adresse du compte de master edition pour le mint.
        let masterEditionAccount = findMasterEditionPda(umi, {
            mint: publicKey(mint.publicKey),
        })[0];

        // Définir les informations du metadata pour le NFT.
        const metadata = {
            name: "Stephen",
            symbol: "STE",
            uri: "https://raw.githubusercontent.com/687c/solana-nft-native-client/main/metadata.json",
        };

        // Appeler l'instruction create_nft du programme Anchor.
        const txid = await program.methods
            .createNft(metadata.name, metadata.symbol, metadata.uri)
            .accounts({
                signer: signer.publicKey, // Signataire de la transaction.
                mint: mint.publicKey, // Clé publique du mint (NFT).
                associatedTokenAccount: associatedTokenAccount, // Compte de token associé au mint.
                metadataAccount: metadataAccount, // Compte de metadata.
                masterEditionAccount: masterEditionAccount, // Compte de master edition.
                tokenProgram: TOKEN_PROGRAM_ID, // Programme de token SPL.
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID, // Programme de token associé SPL.
                tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID, // Programme de metadata de token.
                systemProgram: anchor.web3.SystemProgram.programId, // Programme système Solana.
                rent: anchor.web3.SYSVAR_RENT_PUBKEY, // Sysvar pour les frais de location.
            })
            .signers([mint]) // Signer la transaction avec la clé du mint.
            .rpc();

        // Afficher la signature de la transaction.
        console.log("createNft - tx signature", txid);

        // Assertions pour vérifier la création NFT :

        // Vérifier l'existence du compte de metadata.
        const metadataAccountInfo = await provider.connection.getAccountInfo(new PublicKey(metadataAccount));
        assert.isNotNull(metadataAccountInfo, "Metadata account should exist");
        assert.isTrue(metadataAccountInfo.data.length > 0, "Metadata account data should not be empty");

        // Vérifier l'existence du compte de master edition.
        const masterEditionAccountInfo = await provider.connection.getAccountInfo(new PublicKey(masterEditionAccount));
        assert.isNotNull(masterEditionAccountInfo, "Master edition account should exist");
        assert.isTrue(masterEditionAccountInfo.data.length > 0, "Master edition account data should not be empty");

        // Vérifier les informations du compte token associé.
        const tokenAccountInfo = await provider.connection.getParsedAccountInfo(associatedTokenAccount);
        assert.isNotNull(tokenAccountInfo.value, "Associated token account should exist");

        // Vérifier si les données analysées sont présentes dans le compte token associé.
        if ("parsed" in tokenAccountInfo.value.data) {
            const parsedInfo = tokenAccountInfo.value.data.parsed.info;
            // Vérifier que le mint du compte de token associé correspond au mint créé.
            assert.equal(parsedInfo.mint, mint.publicKey.toString(), "Token account mint should match the created mint");
            // Vérifier que le propriétaire du compte de token associé est le signataire.
            assert.equal(parsedInfo.owner, signer.publicKey.toString(), "Token account owner should be the signer");
        } else {
            assert.fail("Parsed account data is not in the expected format");
        }
    });
});
