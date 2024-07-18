import React, { useEffect, useState } from "react";
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

            // Récupère le programme Anchor et le Provider
            const { connection, program } = getAnchorProgram(wallet);

            try {
                // Récupère les comptes du programme
                const accounts = await connection.getProgramAccounts(new PublicKey(idl.metadata.address));

                // Récupère les données de chaque compte événement
                const eventAccounts = await Promise.all(
                    accounts.map(async ({ pubkey, account }) => {
                        //console.log(`Public Key : ${pubkey.toBase58()}`);

                        try {
                            // Décoder les données du compte avec fetch
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

                // Filtre les comptes valides et met à jour l'état
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
                        <h3>{event.accountData.title}</h3>
                        <p>{event.accountData.description}</p>
                        <p>Date: {new Date(event.accountData.date.toNumber() * 1000).toLocaleDateString()}</p>
                        <p>Lieu: {event.accountData.location}</p>
                        <p>Organisateur: {event.accountData.organizer.toBase58()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListEvents;

/*
txid 3EDEsKUH1zGFAj4hawFXCKEBYZr6mD9F5JYyfiSfUnNP6jMQ8jdEXWS5EnyEi5F7NHHzDd9RmpT3SJZcXtrTCDfB
eventAccount.publicKey.toBase58() 5nNbuSneSWCRoEkN4cEn8xeYJrgd9wXoeKxr7Wcu8eJu

txid 2u4dU4WMMxjPkxprWoanNc3jB1Rr3idT6Jqt2pWWoGpDJqZedprvHXm7dMjd2DWJUsJAog9WcpXrQVtGhbq6hmHm
eventAccount.publicKey.toBase58() G5AfTT7tbnFuZ2AdH5nm9w8jb8AwoTLJLvZmpk4pyYwU
*/
