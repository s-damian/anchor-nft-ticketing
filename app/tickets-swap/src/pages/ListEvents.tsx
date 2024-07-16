import React, { useEffect, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getAnchorProgram } from "../utils/anchorUtils";
import { PublicKey } from "@solana/web3.js";
import { Commitment } from "@solana/web3.js";
import idl from "../idl/tickets_swap.json";

const network = "http://127.0.0.1:8899";
const opts = {
    preflightCommitment: process.env.REACT_APP_SOLANA_COMMITMENT as Commitment,
};

const ListEvents: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const wallet = useAnchorWallet();

    useEffect(() => {
        const fetchEvents = async () => {
            if (!wallet?.publicKey) {
                return;
            }

            // Récupère le programme Anchor et le Provider
            const { connection, program, SystemProgram } = getAnchorProgram(wallet);

            try {
                const accounts = await connection.getProgramAccounts(new PublicKey(idl.metadata.address));

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

                console.log(eventAccounts);
            } catch (err) {
                console.error("Failed to fetch events.", err);
            }
        };

        fetchEvents();
    }, [wallet]);

    return (
        <div>
            <h2>Liste des Événements</h2>
            <ul>
                {events.map((event, index) => (
                    <li key={index}>
                        <h3>{event.title}</h3>
                        <p>{event.description}</p>
                        <p>Date: {new Date(event.date.toNumber() * 1000).toLocaleDateString()}</p>
                        <p>Lieu: {event.location}</p>
                        <p>Organisateur: {event.organizer.toBase58()}</p>
                    </li>
                ))}
            </ul>
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
