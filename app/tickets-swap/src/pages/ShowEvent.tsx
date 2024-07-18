import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { web3, BN } from "@coral-xyz/anchor";
import { getAnchorProgram } from "../utils/anchorUtils";

const ShowEvent: React.FC = () => {
    const { eventPublicKey } = useParams<{ eventPublicKey: string }>();
    const navigate = useNavigate();
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
                const event = await program.account.event.fetch(new web3.PublicKey(eventPublicKey));
                setEventDetails(event);

                // Récupère les tickets associés à l'événement.
                const accounts = await program.account.ticket.all([
                    {
                        memcmp: {
                            offset: 8, // taille de l'en-tête de l'account.
                            bytes: eventPublicKey,
                        },
                    },
                ]);

                setTickets(accounts.map(({ publicKey, account }) => ({ publicKey, account })));
            } catch (err) {
                navigate("/");
            }
        };

        fetchEventDetails();
    }, [wallet, eventPublicKey]);

    const handleSubmitBuyTicket = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!wallet?.publicKey) {
            alert("Veuillez connecter votre portefeuille !");
            return;
        }

        if (!eventPublicKey) {
            return;
        }

        const { program, SystemProgram } = getAnchorProgram(wallet);
        const ticketAccount = web3.Keypair.generate();

        const dateOfPurchase = new BN(new Date().getTime() / 1000); // Convertir la date en secondes puis en BN (BigNumber).

        try {
            const txid = await program.methods
                .buyTicket(dateOfPurchase)
                .accounts({
                    ticket: ticketAccount.publicKey,
                    event: new web3.PublicKey(eventPublicKey),
                    owner: wallet.publicKey,
                    organizer: eventDetails.organizer,
                    //organizer: new PublicKey("DXGaLHJ2w4Q4Jer5gH6qcscKdjNpP8gPadjdRY7Tm3D2"), // (Mon "Compte 3" Phantom, pour MyError::InvalidOrganizer).
                    systemProgram: SystemProgram.programId,
                })
                .signers([ticketAccount])
                .rpc();

            console.log("Success to buy ticket");
            console.log("txid", txid);
            console.log("ticketAccount.publicKey.toBase58()", ticketAccount.publicKey.toBase58());

            // Récupère les tickets après la création d'un nouveau ticket.
            const accounts = await program.account.ticket.all([
                {
                    memcmp: {
                        offset: 8,
                        bytes: eventPublicKey,
                    },
                },
            ]);

            setTickets(accounts.map(({ publicKey, account }) => ({ publicKey, account })));
        } catch (err) {
            console.error("Failed to buy ticket.", err);
        }
    };

    return (
        <>
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
                                <b>Prix du Ticket</b> : {eventDetails.ticketPrice.toString()} Lamports
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
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">Acheter un Ticket</h2>
                    <form className="space-y-6" onSubmit={handleSubmitBuyTicket}>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                                <p>
                                    <b>Prix</b> : {ticket.account.price.toString()} SOL
                                </p>
                                <p>
                                    <b>Date de l'achat</b> : {new Date(ticket.account.dateOfPurchase.toNumber() * 1000).toLocaleDateString()}
                                </p>
                                <p>
                                    <b>Public Key de l'acheteur</b> : {ticket.account.owner.toBase58()}
                                </p>
                                <p>
                                    <b>Public Key du ticket</b> : {ticket.publicKey.toBase58()}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default ShowEvent;
