"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getAnchorProgram } from "../../../src/utils/anchorUtils";
import { handleCopyToClipboard } from "../../../src/utils/various";
import { handleBuyTicket } from "../../../src/utils/handlers/HandleBuyTicket";
import { handleCreateNft } from "../../../src/utils/handlers/HandleCreateNft";
import { PublicKey } from "@solana/web3.js";
import Layout from "../../../src/components/Layout";

const ShowEvent: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const eventPublicKey = pathname.split("/").pop(); // Récupère la clé publique de l'URL

    const [eventDetails, setEventDetails] = useState<any>(null);
    const [tickets, setTickets] = useState<any[]>([]);
    const wallet = useAnchorWallet();

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!wallet?.publicKey || !eventPublicKey) {
                return;
            }

            const { program } = getAnchorProgram(wallet);

            try {
                const event = await program.account.event.fetch(new PublicKey(eventPublicKey));
                setEventDetails(event);

                // Récupère les tickets associés à l'événement.
                const accounts = await program.account.ticket.all([
                    {
                        memcmp: {
                            offset: 8, // Taille de l'en-tête de l'account.
                            bytes: eventPublicKey,
                        },
                    },
                ]);
                setTickets(accounts.map(({ publicKey, account }) => ({ publicKey, account })));
            } catch (err) {
                router.push("/");
            }
        };

        fetchEventDetails();
    }, [wallet, eventPublicKey]);

    return (
        <Layout>
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
                                <b>Date et heure</b> : {new Date(eventDetails.date.toNumber() * 1000).toLocaleString()}
                            </p>
                            <p className="text-center text-gray-700 mb-2">
                                <b>Lieu</b> : {eventDetails.location}
                            </p>
                            <p className="text-center text-gray-700 mb-2">
                                <b>Prix du Ticket</b> : {(eventDetails.ticketPrice.toNumber() / 1_000_000_000).toFixed(9)} SOL
                            </p>
                            <p className="text-center text-gray-700 mb-2">
                                <b>PublicKey de l'organisateur</b> :
                                <span
                                    className="block truncate bg-gray-200 p-1 rounded cursor-pointer"
                                    title={eventDetails.organizer.toBase58()}
                                    onClick={() => handleCopyToClipboard(eventDetails.organizer.toBase58())}
                                >
                                    {eventDetails.organizer.toBase58()}
                                </span>
                            </p>
                            <p className="text-center text-gray-700">
                                <b>PublicKey de l'événement</b> :
                                <span
                                    className="block truncate bg-gray-200 p-1 rounded cursor-pointer"
                                    title={eventPublicKey as string}
                                    onClick={() => handleCopyToClipboard(eventPublicKey as string)}
                                >
                                    {eventPublicKey}
                                </span>
                            </p>
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={(e) => handleBuyTicket(e, eventPublicKey!, eventDetails, wallet, setTickets)}>
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
                                    <b>Prix payé</b> : {(ticket.account.price.toNumber() / 1_000_000_000).toFixed(9)} SOL
                                </p>
                                <p className="mb-2">
                                    <b>Date et heure de l'achat</b> : {new Date(ticket.account.dateOfPurchase.toNumber() * 1000).toLocaleString()}
                                </p>
                                <p className="mb-2">
                                    <b>PublicKey de l'acheteur</b> :{" "}
                                    <span
                                        className="truncate bg-gray-200 p-1 rounded cursor-pointer"
                                        title={ticket.account.owner.toBase58()}
                                        onClick={() => handleCopyToClipboard(ticket.account.owner.toBase58())}
                                    >
                                        {ticket.account.owner.toBase58()}
                                    </span>
                                </p>
                                <p className="mb-2">
                                    <b>PublicKey du ticket</b> :{" "}
                                    <span
                                        className="truncate bg-gray-200 p-1 rounded cursor-pointer"
                                        title={ticket.publicKey.toBase58()}
                                        onClick={() => handleCopyToClipboard(ticket.publicKey.toBase58())}
                                    >
                                        {ticket.publicKey.toBase58()}
                                    </span>
                                </p>
                                {ticket.account.nftMint ? (
                                    <p>
                                        <b>PublicKey NFT Mint</b> :{" "}
                                        <span
                                            className="truncate bg-yellow-200 p-1 rounded cursor-pointer"
                                            title={ticket.account.nftMint.toBase58()}
                                            onClick={() => handleCopyToClipboard(ticket.account.nftMint.toBase58())}
                                        >
                                            {ticket.account.nftMint.toBase58()}
                                        </span>
                                    </p>
                                ) : (
                                    ticket.account.owner.equals(wallet?.publicKey) && (
                                        <button
                                            onClick={() => handleCreateNft(ticket.publicKey, wallet, eventPublicKey!, setTickets)}
                                            className="group relative inline-flex justify-center mt-3 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                                        >
                                            Générer mon NFT
                                        </button>
                                    )
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Layout>
    );
};

export default ShowEvent;
