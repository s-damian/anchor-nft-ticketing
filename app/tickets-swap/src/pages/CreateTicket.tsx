import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { web3, BN } from "@coral-xyz/anchor";
import { getAnchorProgram } from "../utils/anchorUtils";

const CreateTicket: React.FC = () => {
    const { eventPublicKey } = useParams<{ eventPublicKey: string }>();
    const navigate = useNavigate();
    const [price, setPrice] = useState<string>("");
    const [eventDetails, setEventDetails] = useState<any>(null);
    const wallet = useAnchorWallet();

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!wallet?.publicKey || !eventPublicKey) {
                return;
            }

            // Récupère le programme Anchor
            const { program } = getAnchorProgram(wallet);

            try {
                // Récupère les données de l'événement
                const event = await program.account.event.fetch(new web3.PublicKey(eventPublicKey));

                setEventDetails(event);
            } catch (err) {
                // Si eventPublicKey n'est pas une clé public valide
                navigate("/");
            }
        };

        fetchEventDetails();
    }, [wallet, eventPublicKey]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!wallet?.publicKey) {
            alert("Veuillez connecter votre portefeuille !");
            return;
        }

        if (!eventPublicKey) {
            return;
        }

        // Récupère le programme Anchor et le Provider
        const { program, SystemProgram } = getAnchorProgram(wallet);

        // Génère une nouvelle paire de clés pour le compte du ticket
        const ticketAccount = web3.Keypair.generate();

        try {
            // Envoie la transaction pour créer un ticket
            const txid = await program.methods
                .createTicket(new web3.PublicKey(eventPublicKey), new BN(price))
                .accounts({
                    ticket: ticketAccount.publicKey,
                    event: new web3.PublicKey(eventPublicKey),
                    owner: wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .signers([ticketAccount])
                .rpc();

            console.log("Success to create ticket");
            console.log("txid", txid);
            console.log("ticketAccount.publicKey.toBase58()", ticketAccount.publicKey.toBase58());
        } catch (err) {
            console.error("Failed to create ticket.", err);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
                {eventDetails && (
                    <div className="mb-6">
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            <b>Titre</b> : {eventDetails.title}
                        </h2>
                        <p className="text-center text-gray-700">
                            <b>Description</b> : {eventDetails.description}
                        </p>
                        <p className="text-center text-gray-700">
                            <b>Date</b> : {new Date(eventDetails.date.toNumber() * 1000).toLocaleDateString()}
                        </p>
                        <p className="text-center text-gray-700">
                            <b>Lieu</b> : {eventDetails.location}
                        </p>
                        <p className="text-center text-gray-700">
                            <b>Public Key de l'organisateur</b> :
                            <br />
                            {eventDetails.organizer.toBase58()}
                        </p>
                        <p className="text-center text-gray-700">
                            <b>Public Key de l'événement</b> :
                            <br />
                            {eventPublicKey}
                        </p>
                    </div>
                )}
                <h2 className="text-center text-3xl font-extrabold text-gray-900">Créer un Ticket</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="price" className="sr-only">
                                Prix
                            </label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Prix"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Créer le Ticket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTicket;
