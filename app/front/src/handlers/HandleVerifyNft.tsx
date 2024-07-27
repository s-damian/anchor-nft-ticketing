import { PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";
import { getAnchorProgram } from "../utils/anchorUtils";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

export const handleVerifyNft = async (e: React.FormEvent, nftPublicKey: string, eventPublicKey: string, wallet: ReturnType<typeof useAnchorWallet>) => {
    e.preventDefault();

    if (!wallet?.publicKey) {
        toast.error("Veuillez connecter votre portefeuille !");
        return;
    }

    try {
        const { program } = getAnchorProgram(wallet);

        // Vérifier que l'événement existe.
        const eventAccount = await program.account.event.fetch(new PublicKey(eventPublicKey));
        if (!eventAccount) {
            toast.error("Événement introuvable.");
            return;
        }

        // Vérifier que le ticket est associé à l'événement fourni.
        const tickets = await program.account.ticket.all([
            {
                memcmp: {
                    offset: 8, // Taille de l'en-tête de l'account.
                    bytes: eventPublicKey,
                },
            },
        ]);
        // Trouver le ticket avec le mint NFT correspondant.
        const ticket = tickets.find((t) => {
            const nftMint = t.account.nftMint as PublicKey | undefined;
            return nftMint && nftMint.equals(new PublicKey(nftPublicKey));
        });
        if (!ticket) {
            toast.error("Aucun ticket associé à cet événement pour ce NFT.");
            return;
        }

        toast.success("NFT vérifié avec succès !");
    } catch (err) {
        toast.error("Échec de la vérification du NFT.");
        console.error("Failed to verify NFT.", err);
    }
};
