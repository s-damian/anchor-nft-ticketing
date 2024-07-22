import { PublicKey, Connection } from "@solana/web3.js";
import { toast } from "react-toastify";
import { getAnchorProgram } from "../anchorUtils";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { AccountLayout, getAssociatedTokenAddress } from "@solana/spl-token";

export const handleSubmitVerifyNft = async (e: React.FormEvent, nftPublicKey: string, eventPublicKey: string, wallet: ReturnType<typeof useAnchorWallet>) => {
    e.preventDefault();

    if (!wallet?.publicKey) {
        toast.error("Veuillez connecter votre portefeuille !");
        return;
    }

    try {
        const { connection, program } = getAnchorProgram(wallet);

        // Vérifier que l'événement existe.
        const eventAccount = await program.account.event.fetch(new PublicKey(eventPublicKey));
        if (!eventAccount) {
            toast.error("Événement introuvable.");
            return;
        }

        // Obtenir l'adresse du compte de token associé pour le mint du NFT.
        const associatedTokenAccount = await getAssociatedTokenAddress(new PublicKey(nftPublicKey), wallet.publicKey);

        // Vérifier que le compte de token associé existe, et récupérer les informations du compte.
        const tokenAccountInfo = await connection.getParsedAccountInfo(associatedTokenAccount);
        if (!tokenAccountInfo.value) {
            toast.error("Compte de token associé au NFT introuvable.");
            return;
        }

        // Vérifier que le propriétaire du compte de token associé est bien le détenteur du portefeuille connecté.
        const ownerPublicKey = getOwnerPublicKey(tokenAccountInfo.value);
        if (!ownerPublicKey || !ownerPublicKey.equals(wallet.publicKey)) {
            toast.error("Le portefeuille connecté n'est pas le propriétaire du NFT.");
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

// Fonction pour obtenir la clé publique du propriétaire.
const getOwnerPublicKey = (accountInfoValue: any): PublicKey | null => {
    if ("parsed" in accountInfoValue.data) {
        const parsedInfo = accountInfoValue.data.parsed.info;
        if (parsedInfo && parsedInfo.owner) {
            return new PublicKey(parsedInfo.owner);
        } else {
            console.error("parsedInfo.owner is undefined");
        }
    }
    return null;
};
