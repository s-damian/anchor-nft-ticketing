import { web3 } from "@coral-xyz/anchor";
import { toast } from "react-toastify";
import { getAnchorProgram } from "../utils/anchorUtils";
import BN from "bn.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

export const handleCreateEvent = async (
    e: React.FormEvent,
    title: string,
    description: string,
    date: string,
    time: string,
    location: string,
    ticketPrice: string,
    wallet: ReturnType<typeof useAnchorWallet>,
    resetForm: () => void, // Ajoutez ce callback
) => {
    e.preventDefault();

    if (!wallet?.publicKey) {
        toast.error("Veuillez connecter votre portefeuille !");
        return;
    }

    // Récupère le programme Anchor et le Provider.
    const { program, SystemProgram } = getAnchorProgram(wallet);

    // Génère une nouvelle paire de clés pour le compte événement.
    const eventAccount = web3.Keypair.generate();

    try {
        const inputDateTime = new BN(new Date(`${date}T${time}`).getTime() / 1000); // Combiner date et heure, puis convertir en secondes et en BN.
        const price = new BN(ticketPrice); // Convertir le prix en BN (BigNumber).

        // Envoie la transaction pour créer un événement.
        const txid = await program.methods
            .createEvent(title, description, inputDateTime, location, price)
            .accounts({
                event: eventAccount.publicKey,
                organizer: wallet.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([eventAccount])
            .rpc();

        toast.success("Événement créé avec succès !");
        console.log(`solana confirm -v ${txid}`);

        resetForm(); // Reset le formulaire.
    } catch (err) {
        toast.error("Échec de la création de l'événement.");
        console.error("Failed to create event.", err);
    }
};
