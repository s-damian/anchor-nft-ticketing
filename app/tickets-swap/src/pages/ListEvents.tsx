import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getAnchorProgram } from "../utils/anchorUtils";
import { PublicKey } from "@solana/web3.js";
import idl from "../idl/tickets_swap.json";

const ListEvents: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const wallet = useAnchorWallet();

    useEffect(() => {
        const fetchEvents = async () => {
            if (!wallet?.publicKey) {
                return;
            }

            // Récupère le programme Anchor et le Provider.
            const { connection, program } = getAnchorProgram(wallet);

            try {
                // Récupère les comptes du programme.
                const accounts = await connection.getProgramAccounts(new PublicKey(idl.metadata.address));

                // Récupère les données de chaque compte événement.
                const eventAccounts = await Promise.all(
                    accounts.map(async ({ pubkey, account }) => {
                        try {
                            // Décoder les données du compte avec fetch.
                            const fetchedAccountData = await program.account.event.fetch(pubkey);

                            return {
                                publicKey: pubkey,
                                accountData: fetchedAccountData,
                            };
                        } catch (e) {
                            console.error("Failed to fetch or decode account data:", e);
                            return null;
                        }
                    }),
                );

                // Filtre les comptes valides et met à jour l'état.
                setEvents(eventAccounts.filter((account) => account !== null));
            } catch (err) {
                console.error("Failed to fetch events.", err);
            }
        };

        fetchEvents();
    }, [wallet]);

    return (
        <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">Liste des Événements</h2>
            <div>
                {events.map((event, index) => (
                    <div className="w-full p-10 mt-8 bg-white rounded-xl shadow-md" key={index}>
                        <h3 className="mb-2">
                            <b>Titre</b> : {event.accountData.title}
                        </h3>
                        <p className="mb-2">
                            <b>Description</b> : {event.accountData.description}
                        </p>
                        <p className="mb-2">
                            <b>Date</b> : {new Date(event.accountData.date.toNumber() * 1000).toLocaleDateString()}
                        </p>
                        <p className="mb-2">
                            <b>Lieu</b> : {event.accountData.location}
                        </p>
                        <p className="mb-2">
                            <b>Prix du Ticket</b> : {(event.accountData.ticketPrice.toNumber() / 1_000_000_000).toFixed(9)} SOL
                        </p>
                        <p className="mb-2">
                            <b>Public Key de l'organisateur</b> :{" "}
                            <span className="truncate bg-gray-200 p-1 rounded" title={event.accountData.organizer.toBase58()}>
                                {event.accountData.organizer.toBase58()}
                            </span>
                        </p>
                        <p className="mb-2">
                            <b>Public Key de l'événement</b> :{" "}
                            <span className="truncate bg-gray-200 p-1 rounded" title={event.publicKey.toBase58()}>
                                {event.publicKey.toBase58()}
                            </span>
                        </p>
                        <p>
                            <Link
                                to={`/show-event/${event.publicKey.toBase58()}`}
                                className="group relative inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
                            >
                                Aller dans l'événement
                            </Link>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListEvents;
