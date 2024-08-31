import { web3, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";
import { getAnchorProgram } from "../utils/anchorUtils";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

export const handleBuyTicket = async (
    e: React.FormEvent,
    eventPublicKey: string,
    eventDetails: any,
    wallet: ReturnType<typeof useAnchorWallet>,
    setTickets: React.Dispatch<React.SetStateAction<any[]>>,
) => {
    e.preventDefault();

    if (!wallet?.publicKey) {
        toast.error("Veuillez connecter votre portefeuille !");
        return;
    }

    if (!eventPublicKey) {
        return;
    }

    const { program, SystemProgram } = getAnchorProgram(wallet);
    const ticketAccount = web3.Keypair.generate();

    const dateOfPurchase = new BN(new Date().getTime() / 1000); // Convertir la date en secondes puis en BN (BigNumber).

    try {
        const txid = await program.methods
            .buyTicket(dateOfPurchase)
            .accounts({
                ticket: ticketAccount.publicKey,
                event: new PublicKey(eventPublicKey),
                owner: wallet.publicKey,
                organizer: eventDetails.organizer,
                systemProgram: SystemProgram.programId,
            })
            .signers([ticketAccount])
            .rpc();

        toast.success("Ticket acheté avec succès !");
        console.log(`Transaction ID: ${txid}`);

        // Récupère les tickets après la création d'un nouveau ticket.
        const accounts = await program.account.ticket.all([
            {
                memcmp: {
                    offset: 8, // Taille de l'en-tête de l'account.
                    bytes: eventPublicKey,
                },
            },
        ]);
        setTickets(accounts.map(({ publicKey, account }) => ({ publicKey, account })));
    } catch (err) {
        toast.error("Échec de l'achat du ticket.");
        console.error("Failed to buy ticket.", err);
    }
};
