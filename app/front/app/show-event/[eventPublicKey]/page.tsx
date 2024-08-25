"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getAnchorProgram } from "../../../src/utils/anchorUtils";
import { handleCopyToClipboard } from "../../../src/utils/various";
import { handleBuyTicket } from "../../../src/handlers/HandleBuyTicket";
import { handleCreateNft } from "../../../src/handlers/HandleCreateNft";
import { PublicKey } from "@solana/web3.js";
import Layout from "../../../src/components/Layout";
import QRCode from "qrcode.react";

const ShowEvent: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const eventPublicKey = pathname.split("/").pop(); // Récupère la clé publique de l'URL

    const [eventDetails, setEventDetails] = useState<any>(null);
    const [tickets, setTickets] = useState<any[]>([]);
    const wallet = useAnchorWallet();

    const qrCodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

    const handleDownloadQrCode = (nftMint: string) => {
        const qrCodeCanvas = qrCodeRefs.current[nftMint]?.querySelector("canvas");
        if (qrCodeCanvas) {
            const link = document.createElement("a");
            link.href = qrCodeCanvas.toDataURL("image/png");
            link.download = `qrcode-${nftMint}.png`;
            link.click();
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-center">
                <div className="max-w-md w-full space-y-8 p-10 mt-3 bg-white rounded-xl shadow-md">
                    {eventDetails && (
                        <div className="mb-6">
                            <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-3">{eventDetails.title}</h1>
                            <p className="text-center text-gray-700 mb-2">
                                <b>Description</b>: {eventDetails.description}
                            </p>
                            <p className="text-center text-gray-700 mb-2">
                                <b>Date and Time</b>: {new Date(eventDetails.date.toNumber() * 1000).toLocaleString()}
                            </p>
                            <p className="text-center text-gray-700 mb-2">
                                <b>Location</b>: {eventDetails.location}
                            </p>
                            <p className="text-center text-gray-700 mb-2">
                                <b>Ticket Price</b>: {(eventDetails.ticketPrice.toNumber() / 1_000_000_000).toFixed(9)} SOL
                            </p>
                            <p className="text-center text-gray-700 mb-2">
                                <b>Organizer's Public Key</b>:{" "}
                                <span
                                    className="block truncate bg-gray-200 p-1 rounded cursor-pointer"
                                    title={eventDetails.organizer.toBase58()}
                                    onClick={() => handleCopyToClipboard(eventDetails.organizer.toBase58())}
                                >
                                    {eventDetails.organizer.toBase58()}
                                </span>
                            </p>
                            <p className="text-center text-gray-700">
                                <b>Event Public Key</b>:{" "}
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
                                Buy a Ticket
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {tickets.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-center text-2xl font-extrabold text-gray-900">Tickets purchased for this event:</h3>
                    <ul>
                        {tickets.map((ticket, index) => (
                            <li key={index} className="mt-4 p-4 bg-white rounded-md shadow-sm">
                                <p className="mb-2">
                                    <b>Paid Price</b>: {(ticket.account.price.toNumber() / 1_000_000_000).toFixed(9)} SOL
                                </p>
                                <p className="mb-2">
                                    <b>Date and Time of Purchase</b>: {new Date(ticket.account.dateOfPurchase.toNumber() * 1000).toLocaleString()}
                                </p>
                                <p className="mb-2 flex items-center justify-center">
                                    <b>Buyer's Public Key</b>:{" "}
                                    <span
                                        className="truncate bg-gray-200 p-1 rounded cursor-pointer"
                                        onClick={() => handleCopyToClipboard(ticket.account.owner.toBase58())}
                                    >
                                        {ticket.account.owner.toBase58()}
                                    </span>
                                </p>
                                <p className="mb-5 flex items-center justify-center">
                                    <b>Ticket Public Key</b>:{" "}
                                    <span
                                        className="truncate bg-gray-200 p-1 rounded cursor-pointer ml-2"
                                        onClick={() => handleCopyToClipboard(ticket.publicKey.toBase58())}
                                    >
                                        {ticket.publicKey.toBase58()}
                                    </span>
                                </p>
                                {ticket.account.nftMint ? (
                                    <div className="border border-grey-600 p-2 rounded-md text-center">
                                        <p>
                                            <b>NFT Public Key</b>:
                                        </p>
                                        <p className="mt-2 flex items-center justify-center">
                                            <span
                                                className="truncate bg-yellow-200 p-1 rounded cursor-pointer"
                                                onClick={() => handleCopyToClipboard(ticket.account.nftMint.toBase58())}
                                            >
                                                {ticket.account.nftMint.toBase58()}
                                            </span>
                                        </p>
                                        <div
                                            ref={(el) => {
                                                qrCodeRefs.current[ticket.account.nftMint.toBase58()] = el;
                                            }}
                                            onClick={() => handleDownloadQrCode(ticket.account.nftMint.toBase58())}
                                            className="cursor-pointer mx-auto mt-2 flex justify-center"
                                            title="Download QR code"
                                        >
                                            <QRCode value={ticket.account.nftMint.toBase58()} size={80} data-nft-mint={ticket.account.nftMint.toBase58()} />
                                        </div>
                                    </div>
                                ) : (
                                    ticket.account.owner.equals(wallet?.publicKey) && (
                                        <button
                                            onClick={() => handleCreateNft(ticket.publicKey, wallet, eventPublicKey!, setTickets)}
                                            className="group relative inline-flex justify-center mt-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                                        >
                                            Generate My NFT
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
