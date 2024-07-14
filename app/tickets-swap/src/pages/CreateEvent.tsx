import React, { useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, Commitment } from "@solana/web3.js";
import { Program, AnchorProvider, web3, Idl, setProvider } from "@coral-xyz/anchor";
import idl from "../idl/tickets_swap.json";
import BN from "bn.js";

const { SystemProgram } = web3;
const network = "http://127.0.0.1:8899"; // URL du validateur local
const opts = {
    preflightCommitment: "confirmed" as Commitment,
};

const CreateEvent: React.FC = () => {
    // État pour les champs du formulaire
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");

    const wallet = useAnchorWallet();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!wallet?.publicKey) {
            alert("Veuillez connecter votre portefeuille !");
            return;
        }

        // Crée une nouvelle connexion à Solana avec l'URL du validateur local et le niveau de commitment
        const connection = new Connection(network, opts.preflightCommitment);

        // Crée une instance de Provider
        const provider = new AnchorProvider(connection, wallet, opts);
        setProvider(provider);

        // Initialise le programme Anchor
        const program = new Program(idl as Idl, provider);

        // Génère une nouvelle paire de clés pour le compte événement
        const eventAccount = web3.Keypair.generate();

        const inputDate = new BN(new Date(date).getTime() / 1000); // Convertir la date en secondes puis en BN (BigNumber)

        try {
            // Envoie la transaction pour créer un événement
            const txid = await program.methods
                .createEvent(title, description, inputDate, location)
                .accounts({
                    event: eventAccount.publicKey,
                    organizer: wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .signers([eventAccount])
                .rpc();

            console.log("Success: tx signature", txid);
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">Créer un Événement</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="title" className="sr-only">
                                Titre
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Titre"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="sr-only">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Description"
                            />
                        </div>
                        <div>
                            <label htmlFor="date" className="sr-only">
                                Date
                            </label>
                            <input
                                id="date"
                                name="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Date"
                            />
                        </div>
                        <div>
                            <label htmlFor="location" className="sr-only">
                                Lieu
                            </label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Lieu"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Créer l'Événement
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
