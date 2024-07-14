import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TicketsSwap } from "../target/types/tickets_swap";
import { assert } from "chai";
import BN from "bn.js";

describe("create_event", () => {
    // Configure le client pour utiliser le cluster local.
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    // Initialisation du programme Anchor
    const program = anchor.workspace.TicketsSwap as Program<TicketsSwap>;

    it("Creates an event", async () => {
        // Générer une nouvelle paire de clés pour le compte de l'événement
        const event = anchor.web3.Keypair.generate();

        // Détails de l'événement
        const title = "Test Event";
        const description = "This is a test event.";
        const date = new BN(new Date("2023-12-25").getTime() / 1000); // Convertir la date en secondes puis en BN (BigNumber)
        const location = "Test Location";

        // Appeler l'instruction create_event
        const tx = await program.methods
            .createEvent(title, description, date, location)
            .accounts({
                event: event.publicKey, // Compte de l'événement
                organizer: provider.wallet.publicKey, // Organisateur de l'événement
                system_program: anchor.web3.SystemProgram.programId, // Programme système
            })
            .signers([event]) // Signataires de la transaction
            .rpc();
        console.log("createEvent - tx signature", tx);

        // Récupérer les détails du compte de l'événement
        const eventAccount = await program.account.event.fetch(event.publicKey);

        // Assertions pour vérifier que les détails sont corrects
        assert.equal(eventAccount.title, title);
        assert.equal(eventAccount.description, description);
        assert.equal(eventAccount.date.toString(), date.toString());
        assert.equal(eventAccount.location, location);
        assert.equal(eventAccount.organizer.toBase58(), provider.wallet.publicKey.toBase58()); // Vérifie que l'organisateur est correct
    });
});
