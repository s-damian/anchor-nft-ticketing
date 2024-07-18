import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TicketsSwap } from "../target/types/tickets_swap";
import { assert } from "chai";
import BN from "bn.js";

describe("create_event_and_ticket", () => {
    // Configure le client pour utiliser le cluster local.
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    // Initialisation du programme Anchor
    const program = anchor.workspace.TicketsSwap as Program<TicketsSwap>;

    it("Create an event and a ticket", async () => {
        /*
        |--------------------------------------------------------------------------
        | Test create_event:
        |--------------------------------------------------------------------------
        */

        // Générer une nouvelle paire de clés pour le compte de l'événement
        const eventAccount = anchor.web3.Keypair.generate();

        // Détails de l'événement
        const title = "Test Event";
        const description = "This is a test event.";
        const date = new BN(new Date("2023-12-25").getTime() / 1000); // Convertir la date en secondes puis en BN (BigNumber)
        const location = "Test Location";

        // Appeler l'instruction create_event
        const txid = await program.methods
            .createEvent(title, description, date, location)
            .accounts({
                event: eventAccount.publicKey, // Compte de l'événement
                organizer: provider.wallet.publicKey, // Organisateur de l'événement
                systemProgram: anchor.web3.SystemProgram.programId, // Programme système
            })
            .signers([eventAccount]) // Signataires de la transaction
            .rpc();
        console.log("createEvent - tx signature", txid);

        // Récupérer les détails du compte de l'événement
        const eventAccountData = await program.account.event.fetch(eventAccount.publicKey);

        // Assertions pour vérifier que les détails sont corrects
        assert.equal(eventAccountData.title, title);
        assert.equal(eventAccountData.description, description);
        assert.equal(eventAccountData.date.toString(), date.toString());
        assert.equal(eventAccountData.location, location);
        assert.equal(eventAccountData.organizer.toBase58(), provider.wallet.publicKey.toBase58()); // Vérifie que l'organisateur est correct

        /*
        |--------------------------------------------------------------------------
        | Test create_ticket:
        |--------------------------------------------------------------------------
        */

        // Générer une nouvelle paire de clés pour le compte du ticket
        const ticketAccount = anchor.web3.Keypair.generate();
        const ticketPrice = new BN(100);

        // Appeler l'instruction create_ticket
        const ticketTxid = await program.methods
            .createTicket(eventAccount.publicKey, ticketPrice)
            .accounts({
                ticket: ticketAccount.publicKey, // Compte du ticket
                event: eventAccount.publicKey, // Compte de l'événement
                owner: provider.wallet.publicKey, // Propriétaire du ticket
                systemProgram: anchor.web3.SystemProgram.programId, // Programme système
            })
            .signers([ticketAccount]) // Signataires de la transaction
            .rpc();
        console.log("createTicket - tx signature", ticketTxid);

        // Récupérer les détails du compte du ticket
        const ticketAccountData = await program.account.ticket.fetch(ticketAccount.publicKey);

        // Assertions pour vérifier que les détails sont corrects
        assert.equal(ticketAccountData.event.toBase58(), eventAccount.publicKey.toBase58());
        assert.equal(ticketAccountData.price.toString(), ticketPrice.toString());
        assert.equal(ticketAccountData.owner.toBase58(), provider.wallet.publicKey.toBase58()); // Vérifie que le propriétaire est correct
    });
});
