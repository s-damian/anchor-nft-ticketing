import React, { useEffect, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getAnchorProgram } from "../utils/anchorUtils";
import { PublicKey } from "@solana/web3.js";

const ListEvents: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const wallet = useAnchorWallet();

    useEffect(() => {
        const fetchEvents = async () => {
            if (!wallet?.publicKey) {
                alert("Veuillez connecter votre portefeuille !");
                return;
            }

            try {
                const { program } = getAnchorProgram(wallet);

                // Remplacez par vos clés publiques d'événements
                const eventPublicKeys = [
                    new PublicKey("8aZwxNmZTGGNJPE3ogp9qYqqaw4dvT6Y4v3NzL8ZHdC9"),
                    new PublicKey("4UMgDq8Sf7PHC9SHBh45UeQH9pdEf9CTbwk4iUPmLCxh"),
                ];

                const eventAccounts = await Promise.all(
                    eventPublicKeys.map(async (publicKey) => {
                        // Appel explicite de getEvent si nécessaire
                        await program.methods.getEvent().accounts({ event: publicKey }).rpc();

                        // Récupération du compte de l'événement
                        const event = await program.account.event.fetch(publicKey);
                        return event;
                    }),
                );

                setEvents(eventAccounts);
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
txid 2Rb63oMoS3bT1H6GPD6AoCCYBzM14S32EJ1RTkRX6GnJfhHUiqe2wvyVu1hzM8Aegbg1gDd9PGXg2dHJJxU1ULuv
eventAccount.publicKey.toBase58() 8aZwxNmZTGGNJPE3ogp9qYqqaw4dvT6Y4v3NzL8ZHdC9

txid 2Tac7zbAnctcu8wp8q4oNihkWTuV7AtrHrKpXodTyN6CdHgG6qKKvsdBXaWLvq1ojdUaJM6couk5GKSq1EpSTPMn
eventAccount.publicKey.toBase58() 4UMgDq8Sf7PHC9SHBh45UeQH9pdEf9CTbwk4iUPmLCxh
*/
