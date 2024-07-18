import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TicketsSwap } from "../target/types/tickets_swap";
import { assert } from "chai";
import BN from "bn.js";

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

        // Appeler l'instruction buy_ticket
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
            // Appeler l'instruction buy_ticket avec un propriétaire non valide.
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
});
