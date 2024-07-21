import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { web3, BN } from "@coral-xyz/anchor";
import { getAnchorProgram } from "../utils/anchorUtils";
import { PublicKey, SystemProgram } from "@solana/web3.js";
// Imports ajoutés pour le NFT :
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { findMasterEditionPda, findMetadataPda, mplTokenMetadata, MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

const ShowEvent: React.FC = () => {
    const { eventPublicKey } = useParams<{ eventPublicKey: string }>();
    const navigate = useNavigate();
    const [eventDetails, setEventDetails] = useState<any>(null);
    const [tickets, setTickets] = useState<any[]>([]);
    const wallet = useAnchorWallet();

    const getEventPublicKeyFilter = (eventPublicKey: string) => {
        return [
            {
                memcmp: {
                    offset: 8, // taille de l'en-tête de l'account.
                    bytes: eventPublicKey,
                },
            },
        ];
    };

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!wallet?.publicKey || !eventPublicKey) {
                return;
            }

            const { program } = getAnchorProgram(wallet);

            try {
                const event = await program.account.event.fetch(new web3.PublicKey(eventPublicKey));
                //const event = await program.account.event.fetch(new PublicKey(eventPublicKey));
                setEventDetails(event);

                // Récupère les tickets associés à l'événement.
                const accounts = await program.account.ticket.all(getEventPublicKeyFilter(eventPublicKey));

                setTickets(accounts.map(({ publicKey, account }) => ({ publicKey, account })));
            } catch (err) {
                navigate("/");
            }
        };

        fetchEventDetails();
    }, [wallet, eventPublicKey]);

    const handleSubmitBuyTicket = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!wallet?.publicKey) {
            alert("Veuillez connecter votre portefeuille !");
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
                    event: new web3.PublicKey(eventPublicKey),
                    //event: new PublicKey(eventPublicKey),
                    owner: wallet.publicKey,
                    organizer: eventDetails.organizer,
                    //organizer: new PublicKey("DXGaLHJ2w4Q4Jer5gH6qcscKdjNpP8gPadjdRY7Tm3D2"), // (Mon "Compte 3" Phantom, pour CustomError::CreateTicketInvalidOrganizer).
                    systemProgram: SystemProgram.programId,
                })
                .signers([ticketAccount])
                .rpc();

            console.log("Success to buy ticket");
            console.log("solana confirm -v " + txid);

            // Récupère les tickets après la création d'un nouveau ticket.
            const accounts = await program.account.ticket.all(getEventPublicKeyFilter(eventPublicKey));

            setTickets(accounts.map(({ publicKey, account }) => ({ publicKey, account })));
        } catch (err) {
            console.error("Failed to buy ticket.", err);
        }
    };

    const handleSubmitCreateNft = async (ticketPublicKey: PublicKey) => {
        /*if (!wallet?.publicKey) {
            alert("Veuillez connecter votre portefeuille !");
            return;
        }

        const { program } = getAnchorProgram(wallet);

        // Initialisation de UMI avec les identités de portefeuille et le module mplTokenMetadata.
        const umi = createUmi("http://127.0.0.1:8899").use(mplTokenMetadata()).use(walletAdapterIdentity(wallet));
        //const umi = createUmi("https://api.devnet.solana.com").use(mplTokenMetadata()).use(walletAdapterIdentity(wallet));

        // Génération d'une nouvelle paire de clés pour le mint (NFT).
        const mint = web3.Keypair.generate();

        // Dérivez le compte d'adresse de jeton associé à l'atelier monétaire.
        // Calculer l'adresse du compte de token associé pour le mint.
        const associatedTokenAccount = await getAssociatedTokenAddress(mint.publicKey, wallet.publicKey);

        // Dérivez le compte de metadata PDA.
        // Calculer l'adresse du compte de metadata pour le mint.
        let metadataAccount = findMetadataPda(umi, {
            mint: publicKey(mint.publicKey),
        })[0];

        // Dérivez l'édition principale PDA.
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

        try {
            // Appeler l'instruction create_nft du programme Anchor.
            const txid = await program.methods
                .createNft(metadata.name, metadata.symbol, metadata.uri)
                .accounts({
                    signer: wallet.publicKey, // Signataire de la transaction.
                    mint: mint.publicKey, // Clé publique du mint (NFT).
                    associatedTokenAccount: associatedTokenAccount, // Compte de token associé au mint.
                    metadataAccount: metadataAccount, // Compte de metadata.
                    masterEditionAccount: masterEditionAccount, // Compte de master edition.
                    tokenProgram: TOKEN_PROGRAM_ID, // Programme de token SPL.
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID, // Programme de token associé SPL.
                    //tokenMetadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"), // Programme de metadata de token.
                    tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID, // Programme de metadata de token.
                    systemProgram: SystemProgram.programId, // Programme système Solana.
                    rent: web3.SYSVAR_RENT_PUBKEY, // Sysvar pour les frais de location.
                    ticket: ticketPublicKey, // Compte du ticket.
                })
                .signers([mint]) // Signer la transaction avec la clé du mint.
                .rpc();

            console.log("createNft - tx signature", txid);

            // Mettre à jour les tickets après la création du NFT.
            const accounts = await program.account.ticket.all(getEventPublicKeyFilter(eventPublicKey!));
            setTickets(accounts.map(({ publicKey, account }) => ({ publicKey, account })));
        } catch (err) {
            console.error("Failed to create NFT.", err);
        }*/
    };

    return (
        <>
            <div className="flex items-center justify-center">
                <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
                    {eventDetails && (
                        <div className="mb-6">
                            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
                                <b>Titre</b> : {eventDetails.title}
                            </h2>
                            <p className="text-center text-gray-700 mb-2">
                                <b>Description</b> : {eventDetails.description}
                            </p>
                            <p className="text-center text-gray-700 mb-2">
                                <b>Date</b> : {new Date(eventDetails.date.toNumber() * 1000).toLocaleDateString()}
                            </p>
                            <p className="text-center text-gray-700 mb-2">
                                <b>Lieu</b> : {eventDetails.location}
                            </p>
                            <p className="text-center text-gray-700 mb-2">
                                <b>Prix du Ticket</b> : {(eventDetails.ticketPrice.toNumber() / 1_000_000_000).toFixed(9)} SOL
                            </p>
                            <p className="text-center text-gray-700 mb-2">
                                <b>Public Key de l'organisateur</b> :
                                <span className="block truncate bg-gray-200 p-1 rounded" title={eventDetails.organizer.toBase58()}>
                                    {eventDetails.organizer.toBase58()}
                                </span>
                            </p>
                            <p className="text-center text-gray-700">
                                <b>Public Key de l'événement</b> :
                                <span className="block truncate bg-gray-200 p-1 rounded" title={eventPublicKey}>
                                    {eventPublicKey}
                                </span>
                            </p>
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmitBuyTicket}>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Acheter un Ticket
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {tickets.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-center text-2xl font-extrabold text-gray-900">Tickets achetés pour cet événement</h3>
                    <ul>
                        {tickets.map((ticket, index) => (
                            <li key={index} className="mt-4 p-4 bg-white rounded-md shadow-sm">
                                <p className="mb-2">
                                    <b>Prix</b> : {(ticket.account.price.toNumber() / 1_000_000_000).toFixed(9)} SOL
                                </p>
                                <p className="mb-2">
                                    <b>Date de l'achat</b> : {new Date(ticket.account.dateOfPurchase.toNumber() * 1000).toLocaleDateString()}
                                </p>
                                <p className="mb-2">
                                    <b>Public Key de l'acheteur</b> :{" "}
                                    <span className="truncate bg-gray-200 p-1 rounded" title={ticket.account.owner.toBase58()}>
                                        {ticket.account.owner.toBase58()}
                                    </span>
                                </p>
                                <p>
                                    <b>Public Key du ticket</b> :{" "}
                                    <span className="truncate bg-gray-200 p-1 rounded" title={ticket.publicKey.toBase58()}>
                                        {ticket.publicKey.toBase58()}
                                    </span>
                                </p>

                                {ticket.account.nftMint ? (
                                    <p>
                                        <b>NFT Mint</b> :{" "}
                                        <span className="truncate bg-gray-200 p-1 rounded" title={ticket.account.nftMint.toBase58()}>
                                            {ticket.account.nftMint.toBase58()}
                                        </span>
                                    </p>
                                ) : (
                                    <button
                                        onClick={() => handleSubmitCreateNft(ticket.publicKey)}
                                        className="group relative inline-flex justify-center mt-3 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                    >
                                        Générer mon NFT
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default ShowEvent;
