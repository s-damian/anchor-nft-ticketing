import { AnchorProvider, Program, setProvider, web3, workspace, BN } from "@coral-xyz/anchor";
import { NftTicketing } from "../target/types/nft_ticketing";
import { assert } from "chai";
//import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";
// Imports ajoutés pour le NFT :
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { findMasterEditionPda, findMetadataPda, mplTokenMetadata, MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

describe("create_event_and_ticket", () => {
    // Configure le client pour utiliser le cluster local.
    const provider = AnchorProvider.env();
    setProvider(provider);

    // Initialisation du programme Anchor.
    const program = workspace.NftTicketing as Program<NftTicketing>;

    // Générer une nouvelle paire de clés pour le compte de l'événement.
    const eventAccount = web3.Keypair.generate();

    // 20000000000 Lamports = 20 SOL.
    const ticketPrice = new BN(20000000000);

    // Paire de clés pour le compte du ticketAccount qui sera utilisé pour tester le success, et pour tester la création du NFT.
    const ticketAccountForNft = web3.Keypair.generate();

    // SUCCESS create_event
    it("Create an event", async () => {
        const organizerWallet = provider.wallet;

        // Détails de l'événement.
        const title = "Event A";
        const description = "Description of Event A";
        const date = new BN(new Date("2023-12-25").getTime() / 1000); // Convertir la date en secondes puis en BN (BigNumber).
        const location = "Paris";

        // Capturer le solde de l'organisateur avant la création de l'événement
        const organizerBalanceBefore = await provider.connection.getBalance(organizerWallet.publicKey);

        // Appeler l'instruction create_event
        const txid = await program.methods
            .createEvent(title, description, date, location, ticketPrice)
            .accounts({
                event: eventAccount.publicKey, // Compte de l'événement.
                organizer: organizerWallet.publicKey, // Organisateur de l'événement.
                systemProgram: web3.SystemProgram.programId, // Programme système.
            })
            .signers([eventAccount]) // Signataires de la transaction.
            .rpc();
        console.log("createEvent - Transaction ID:", txid);

        // Récupérer les détails du compte de l'événement.
        const eventAccountData = await program.account.event.fetch(eventAccount.publicKey);

        // Vérifier les détails de l'événement.
        assert.equal(eventAccountData.title, title);
        assert.equal(eventAccountData.description, description);
        assert.equal(eventAccountData.date.toString(), date.toString());
        assert.equal(eventAccountData.location, location);
        assert.equal(eventAccountData.ticketPrice.toString(), ticketPrice.toString());
        assert.equal(eventAccountData.organizer.toBase58(), organizerWallet.publicKey.toBase58()); // Vérifie que l'organisateur est correct.

        // Vérifier le solde après la création de l'event (vérifier que l'organisateur a bien payé des frais pour la transaction).
        const organizerBalanceAfter = await provider.connection.getBalance(organizerWallet.publicKey);
        assert.isBelow(organizerBalanceAfter, organizerBalanceBefore, "Organizer balance should decrease after the transaction.");
    });

    // ERROR buy_ticket
    it("Attempt to buy a ticket with an invalid owner", async () => {
        // Récupérer les détails du compte de l'événement.
        const eventAccountData = await program.account.event.fetch(eventAccount.publicKey);

        // Générer une nouvelle paire de clés pour le compte du ticket.
        const ticketAccount = web3.Keypair.generate();
        const dateOfPurchase = new BN(new Date().getTime() / 1000); // Date actuelle en secondes.

        // Générer une clé publique non valide pour le propriétaire.
        const invalidOwner = web3.Keypair.generate();

        // Solde initial de l'organisateur.
        const organizerBalanceBefore = await provider.connection.getBalance(eventAccountData.organizer);

        try {
            // Appeler l'instruction buy_ticket du programme Anchor.
            // Le faire avec un propriétaire non valide.
            await program.methods
                .buyTicket(dateOfPurchase)
                .accounts({
                    ticket: ticketAccount.publicKey, // Compte du ticket.
                    event: eventAccount.publicKey, // Compte de l'événement.
                    owner: invalidOwner.publicKey, // Propriétaire non valide du ticket.
                    organizer: eventAccountData.organizer, // Organizer de l'événement.
                    systemProgram: web3.SystemProgram.programId, // Programme système.
                })
                .signers([ticketAccount]) // Signataires de la transaction.
                .rpc();

            // Si le transfert réussit, échouer le test.
            assert.fail("The transaction should have failed but it succeeded.");
        } catch (err) {
            // Vérifier que l'erreur est du type attendu
            assert.include(err.message, "Signature verification failed", "Expected a signature verification error");
        }

        // Vérifier qu'aucun transfert de SOL n'a eu lieu.
        const organizerBalanceAfter = await provider.connection.getBalance(eventAccountData.organizer);
        assert.equal(organizerBalanceAfter, organizerBalanceBefore, "Organizer balance should not change");

        // Vérifier que le ticket n'a pas été créé.
        const ticketAccountInfo = await provider.connection.getAccountInfo(ticketAccount.publicKey);
        assert.isNull(ticketAccountInfo, "Ticket account should not exist");
    });

    // SUCCESS buy_ticket
    it("Attempt to buy a ticket with success", async () => {
        const ownerWallet = provider.wallet;

        // Récupérer les détails du compte de l'événement.
        const eventAccountData = await program.account.event.fetch(eventAccount.publicKey);

        // Générer une nouvelle paire de clés pour le compte du ticket.
        const dateOfPurchase = new BN(new Date().getTime() / 1000); // Date actuelle en secondes.

        // Appeler l'instruction buy_ticket du programme Anchor.
        const txid = await program.methods
            .buyTicket(dateOfPurchase)
            .accounts({
                ticket: ticketAccountForNft.publicKey, // Compte du ticket.
                event: eventAccount.publicKey, // Compte de l'événement.
                owner: ownerWallet.publicKey, // Propriétaire du ticket.
                organizer: eventAccountData.organizer, // Organizer de l'événement.
                systemProgram: web3.SystemProgram.programId, // Programme système.
            })
            .signers([ticketAccountForNft]) // Signataires de la transaction.
            .rpc();
        console.log("buyTicket - Transaction ID:", txid);

        // Récupérer les détails du compte du ticket
        const ticketAccountData = await program.account.ticket.fetch(ticketAccountForNft.publicKey);

        // Vérifier les détails du ticket.
        assert.equal(ticketAccountData.event.toBase58(), eventAccount.publicKey.toBase58());
        assert.equal(ticketAccountData.price.toString(), ticketPrice.toString());
        assert.equal(ticketAccountData.dateOfPurchase.toString(), dateOfPurchase.toString());
        assert.equal(ticketAccountData.owner.toBase58(), ownerWallet.publicKey.toBase58()); // Vérifie que le propriétaire est correct.
        assert.isNull(ticketAccountData.nftMint, "The nft_mint should be null initially");

        // Vérifier que le compte du ticket a été créé.
        const ticketAccountInfo = await provider.connection.getAccountInfo(ticketAccountForNft.publicKey);
        assert.isNotNull(ticketAccountInfo, "Ticket account should exist");
    });

    // SUCCESS create_nft
    it("Attempt to create a NFT", async () => {
        const signerWallet = provider.wallet; // PS : le signerWallet du NFT c'est le ownerWallet du ticket.

        // Initialisation de UMI avec les identités de portefeuille et le module mplTokenMetadata.
        const umi = createUmi("http://127.0.0.1:8899").use(mplTokenMetadata()).use(walletAdapterIdentity(signerWallet));

        // Génération d'une nouvelle paire de clés pour le mint (NFT).
        const mint = web3.Keypair.generate();

        // Dériver le compte d'adresse de jeton associé à l'atelier monétaire.
        // Calculer l'adresse du compte de token associé pour le mint.
        const associatedTokenAccount = await getAssociatedTokenAddress(mint.publicKey, signerWallet.publicKey);

        // Dériver le compte de metadata PDA.
        // Calculer l'adresse du compte de metadata pour le mint.
        let metadataAccount = findMetadataPda(umi, {
            mint: publicKey(mint.publicKey),
        })[0];

        // Dériver l'édition principale PDA.
        // Calculer l'adresse du compte de master edition pour le mint.
        let masterEditionAccount = findMasterEditionPda(umi, {
            mint: publicKey(mint.publicKey),
        })[0];

        // Définir les informations du metadata pour le NFT.
        const metadata = {
            name: "AlyraSOL",
            symbol: "ASOL",
            uri: "https://example.com/my-nft.json",
        };

        // Vérifier que le ticket existe et n'a pas déjà un NFT
        const ticketAccountDataBefore = await program.account.ticket.fetch(ticketAccountForNft.publicKey);
        assert.isNull(ticketAccountDataBefore.nftMint, "The ticket should not have an NFT before creation");

        const signerBalanceBefore = await provider.connection.getBalance(signerWallet.publicKey);

        // Appeler l'instruction create_nft du programme Anchor.
        const txid = await program.methods
            .createNft(metadata.name, metadata.symbol, metadata.uri)
            .accounts({
                signer: signerWallet.publicKey, // Signataire de la transaction.
                mint: mint.publicKey, // Clé publique du mint (NFT).
                associatedTokenAccount: associatedTokenAccount, // Compte de token associé au mint.
                metadataAccount: metadataAccount, // Compte de metadata.
                masterEditionAccount: masterEditionAccount, // Compte de master edition.
                tokenProgram: TOKEN_PROGRAM_ID, // Programme de token SPL.
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID, // Programme de token associé SPL.
                tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID, // Programme de metadata de token.
                systemProgram: web3.SystemProgram.programId, // Programme système Solana.
                rent: web3.SYSVAR_RENT_PUBKEY, // Sysvar pour les frais de location.
                ticket: ticketAccountForNft.publicKey, // Compte du ticket. // Pour joindre le NFT au ticket.
            })
            .signers([mint]) // Signer la transaction avec la clé du mint.
            .rpc();

        // Afficher la signature de la transaction.
        console.log("createNft - Transaction ID:", txid);

        // Vérifier le solde après la création du NFT (vérifier que le signer a bien payé des frais pour la transaction).
        const signerBalanceAfter = await provider.connection.getBalance(signerWallet.publicKey);
        assert.isBelow(signerBalanceAfter, signerBalanceBefore, "Signer balance should decrease after the transaction.");

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
            const parsedInfo = tokenAccountInfo.value.data.parsed.info; // On accède aux informations parsées.
            // Vérifier que le mint du compte de token associé correspond au mint créé.
            assert.equal(parsedInfo.mint, mint.publicKey.toString(), "Token account mint should match the created mint");
            // Vérifier que le propriétaire du compte de token associé est le signataire.
            assert.equal(parsedInfo.owner, signerWallet.publicKey.toString(), "Token account owner should be the signer");
        } else {
            assert.fail("Parsed account data is not in the expected format");
        }

        // Pour joindre le NFT au ticket.
        // Vérifier que le champ nft_mint du ticket est mis à jour correctement.
        const ticketAccountData = await program.account.ticket.fetch(ticketAccountForNft.publicKey);
        assert.isNotNull(ticketAccountData.nftMint, "The ticket should have an NFT after creation");
        assert.equal(ticketAccountData.nftMint.toBase58(), mint.publicKey.toBase58(), "The nft_mint should match the created mint");
    });

    // SUCCESS verify NFT (tester juste de la même manière dont le Front-End se comporte).
    it("Verify NFT is associated with the correct ticket and event", async () => {
        // Assume we have already created an event and a ticket, and minted an NFT in previous tests
        const eventPublicKey = eventAccount.publicKey;
        const ticketAccountData = await program.account.ticket.fetch(ticketAccountForNft.publicKey);

        // S'assurer que le ticket appartient à l'événement.
        assert.equal(ticketAccountData.event.toBase58(), eventPublicKey.toBase58(), "The ticket should be associated with the correct event");

        // S'assurer que le champ nftMint est renseigné.
        assert.isNotNull(ticketAccountData.nftMint, "The ticket should have an associated NFT mint");

        // Vérifier que le mint du NFT est correct.
        const nftPublicKey = ticketAccountData.nftMint.toBase58(); // Define nftPublicKey for use in the verification step

        // Vérifier que le ticket est associé à l'événement fourni.
        const tickets = await program.account.ticket.all([
            {
                memcmp: {
                    offset: 8, // Taille de l'en-tête de l'account.
                    bytes: eventPublicKey.toBase58(),
                },
            },
        ]);

        // Trouver le ticket avec le mint NFT correspondant.
        const ticket = tickets.find((t) => {
            const nftMint = t.account.nftMint as PublicKey | undefined;
            return nftMint && nftMint.equals(new PublicKey(nftPublicKey));
        });

        if (ticket) {
            assert.equal(ticket.account.event.toBase58(), eventPublicKey.toBase58(), "The ticket's event should match the provided event public key");

            // Une vérification supplémentaire est ajoutée pour s'assurer que le mint du NFT est bien celui attendu.
            assert.equal(ticket.account.nftMint.toBase58(), nftPublicKey, "The NFT mint should match the one associated with the ticket");

            // Vérifier que le propriétaire du ticket correspond au propriétaire du NFT :
            // Obtenir l'adresse du compte associé au token pour le propriétaire du ticket.
            const associatedTokenAccount = await getAssociatedTokenAddress(new PublicKey(nftPublicKey), ticket.account.owner);
            // Récupérer les informations du compte de token associé.
            const tokenAccountInfo = await provider.connection.getParsedAccountInfo(associatedTokenAccount);
            assert.isNotNull(tokenAccountInfo.value, "The associated token account should exist");
            if ("parsed" in tokenAccountInfo.value.data) {
                const parsedInfo = tokenAccountInfo.value.data.parsed.info; // On accède aux informations parsées.
                // Vérifier que le propriétaire du compte de token associé est le même que le propriétaire du ticket.
                // "parsedInfo.owner" contient la clé publique du propriétaire du compte de token associé.
                // On vérifie que cette clé publique correspond à celle du propriétaire du ticket.
                assert.equal(parsedInfo.owner, ticket.account.owner.toBase58(), "The NFT owner should match the ticket owner");
                // Vérification de l'unicité : En vérifiant que le montant est exactement "1", nous nous assurons que :
                // a) Le NFT a bien été minté (le montant n'est pas 0).
                // b) Il n'y a pas eu de duplication accidentelle du NFT (le montant n'est pas supérieur à 1).
                assert.equal(parsedInfo.tokenAmount.amount, "1", "The NFT token amount should be 1");
            } else {
                assert.fail("Parsed account data is not in the expected format");
            }
        } else {
            assert.fail("A ticket associated with this event for this NFT should exist");
        }
    });
});
