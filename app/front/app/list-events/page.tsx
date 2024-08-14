"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getAnchorProgram } from "../../src/utils/anchorUtils";
import { handleCopyToClipboard } from "../../src/utils/various";
import { PublicKey } from "@solana/web3.js";
import idl from "../../src/idl/nft_ticketing.json";
import Layout from "../../src/components/Layout";

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
                const accounts = await connection.getProgramAccounts(new PublicKey(idl.address));

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
        <Layout>
            <div>
                <h1 className="text-center text-3xl font-extrabold text-gray-900">Liste des Événements</h1>
                <p className="text-gray-600 mb-4 mt-4">
                    Découvrez tous les événements créés sur la blockchain Solana. Cliquez sur un événement pour en savoir plus et acheter des tickets en toute
                    sécurité.
                </p>
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
                                <b>Date et heure</b> : {new Date(event.accountData.date.toNumber() * 1000).toLocaleString()}
                            </p>
                            <p className="mb-2">
                                <b>Lieu</b> : {event.accountData.location}
                            </p>
                            <p className="mb-2">
                                <b>Prix du Ticket</b> : {(event.accountData.ticketPrice.toNumber() / 1_000_000_000).toFixed(9)} SOL
                            </p>
                            <p className="mb-2 flex items-center justify-center">
                                <b>Clé publique de l'organisateur</b> :{" "}
                                <span
                                    className="truncate bg-gray-200 p-1 rounded cursor-pointer ml-2"
                                    onClick={() => handleCopyToClipboard(event.accountData.organizer.toBase58())}
                                >
                                    {event.accountData.organizer.toBase58()}
                                </span>
                            </p>
                            <p className="mb-2 flex items-center justify-center">
                                <b>Clé publique de l'événement</b> :{" "}
                                <span
                                    className="truncate bg-gray-200 p-1 rounded cursor-pointer ml-2"
                                    onClick={() => handleCopyToClipboard(event.publicKey.toBase58())}
                                >
                                    {event.publicKey.toBase58()}
                                </span>
                            </p>
                            <p>
                                <Link
                                    href={`/show-event/${event.publicKey.toBase58()}`}
                                    className="group relative inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 mt-4"
                                >
                                    Aller dans l'événement
                                </Link>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ListEvents;
