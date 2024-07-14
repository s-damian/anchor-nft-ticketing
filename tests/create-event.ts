import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TicketsSwap } from "../target/types/tickets_swap";
import { assert } from "chai";
import BN from "bn.js";

describe("create_event", () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.TicketsSwap as Program<TicketsSwap>;

    it("Creates an event", async () => {
        // Generate a new keypair for the event account
        const event = anchor.web3.Keypair.generate();

        // Details of the event
        const title = "Test Event";
        const description = "This is a test event.";
        //const date = new Date("2023-12-25").getTime();
        //const date = new Date("2023-12-25").getTime() / 1000; // Convert to seconds
        const date = new BN(new Date("2023-12-25").getTime() / 1000); // Convert to seconds and then to BN
        const location = "Test Location";

        // Call the create_event instruction
        await program.methods
            .createEvent(title, description, date, location)
            .accounts({
                event: event.publicKey,
                organizer: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([event])
            .rpc();

        // Fetch the account details
        const eventAccount = await program.account.event.fetch(event.publicKey);

        // Assertions
        assert.equal(eventAccount.title, title);
        assert.equal(eventAccount.description, description);
        assert.equal(eventAccount.date.toString(), date.toString());
        assert.equal(eventAccount.location, location);
        assert.equal(eventAccount.organizer.toBase58(), provider.wallet.publicKey.toBase58());
    });
});
