"use client";

import React, { useState, useEffect } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { web3 } from "@coral-xyz/anchor";
import { handleCreateEvent } from "../../src/handlers/HandleCreateEvent";
import Layout from "../../src/components/Layout";

const CreateEvent: React.FC = () => {
    // État pour les champs du formulaire.
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>(""); // État pour l'heure
    const [location, setLocation] = useState<string>("");
    const [ticketPrice, setTicketPrice] = useState<string>(""); // Valeur en Lamports. PS: 1 SOL = 10^9 Lamports. 1 SOL = 1,000,000,000 Lamports (9 zéros).

    const [ticketPriceInSOL, setTicketPriceInSOL] = useState<string>(""); // Pour afficher la valeur en SOL.
    const wallet = useAnchorWallet();

    useEffect(() => {
        const priceInLamports = parseFloat(ticketPrice);
        if (!isNaN(priceInLamports)) {
            // Convertir de Lamports à SOL pour pour l'UX.
            setTicketPriceInSOL((priceInLamports / web3.LAMPORTS_PER_SOL).toFixed(9));
        } else {
            setTicketPriceInSOL("");
        }
    }, [ticketPrice]);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setDate("");
        setTime("");
        setLocation("");
        setTicketPrice("");
        setTicketPriceInSOL("");
    };

    return (
        <Layout>
            <div className="flex items-center justify-center">
                <div className="max-w-md w-full space-y-8 p-10 mt-3 bg-white rounded-xl shadow-md">
                    <h1 className="text-center text-3xl font-extrabold text-gray-900">Create an Event</h1>
                    <p className="text-gray-600 mb-4">Create a unique event on the Solana blockchain and securely sell tickets as NFTs.</p>
                    <form
                        className="space-y-6"
                        onSubmit={(e) => handleCreateEvent(e, title, description, date, time, location, ticketPrice, wallet, resetForm)}
                    >
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md sm:text-sm"
                                    placeholder="Title"
                                />
                            </div>
                            <div>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm"
                                    placeholder="Description"
                                />
                            </div>
                            <div>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    className="rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm"
                                    placeholder="Date"
                                />
                            </div>
                            <div>
                                <input
                                    id="time"
                                    name="time"
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                    className="rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm"
                                    placeholder="Time"
                                />
                            </div>
                            <div>
                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                    className="rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm"
                                    placeholder="Location"
                                />
                            </div>
                            <div>
                                <input
                                    id="ticketPrice"
                                    name="ticketPrice"
                                    type="number"
                                    value={ticketPrice}
                                    onChange={(e) => setTicketPrice(e.target.value)}
                                    required
                                    className="rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md sm:text-sm"
                                    placeholder="Ticket Price (Lamports)"
                                />
                            </div>
                            {ticketPrice && <span className="text-gray-600">({ticketPriceInSOL} SOL)</span>}
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Create Event
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CreateEvent;
