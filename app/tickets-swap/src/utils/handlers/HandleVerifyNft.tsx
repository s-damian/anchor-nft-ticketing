import { PublicKey, Connection } from "@solana/web3.js";
import { toast } from "react-toastify";
import { getAnchorProgram } from "../anchorUtils";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { AccountLayout, getAssociatedTokenAddress } from "@solana/spl-token";

// Remplacez par votre URL de connexion
const connection = new Connection("http://127.0.0.1:8899");

export const handleSubmitVerifyNft = async (e: React.FormEvent, nftPublicKey: string, eventPublicKey: string, wallet: ReturnType<typeof useAnchorWallet>) => {
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

        // Obtenir l'adresse du compte de token associé pour le mint du NFT.
        const associatedTokenAccount = await getAssociatedTokenAddress(new PublicKey(nftPublicKey), wallet.publicKey);
        console.log("associatedTokenAccount", associatedTokenAccount.toBase58());

        // Vérifier que le compte de token associé existe, et récupérer les informations du compte.
        const tokenAccountInfo = await connection.getParsedAccountInfo(associatedTokenAccount);
        console.log("tokenAccountInfo", tokenAccountInfo);
        if (!tokenAccountInfo.value) {
            toast.error("Compte de token associé au NFT introuvable.");
            return;
        }

        // Vérifier que le propriétaire du compte de token associé est bien le détenteur du portefeuille connecté.
        const ownerPublicKey = getOwnerPublicKey(tokenAccountInfo.value);
        if (ownerPublicKey && ownerPublicKey.equals(wallet.publicKey)) {
            toast.success("NFT vérifié avec succès !");
        } else {
            toast.error("Le portefeuille connecté n'est pas le propriétaire du NFT.");
        }
    } catch (err) {
        toast.error("Échec de la vérification du NFT.");
        console.error("Failed to verify NFT.", err);
    }
};

// Fonction pour obtenir la clé publique du propriétaire.
const getOwnerPublicKey = (accountInfo: any): PublicKey | null => {
    if (accountInfo.data instanceof Buffer) {
        const tokenAccount = AccountLayout.decode(accountInfo.data);
        return new PublicKey(tokenAccount.owner);
    } else if ("parsed" in accountInfo.data) {
        const parsedInfo = accountInfo.data.parsed.info;
        if (parsedInfo && parsedInfo.owner) {
            return new PublicKey(parsedInfo.owner);
        } else {
            console.error("parsedInfo.owner is undefined");
        }
    }
    return null;
};
