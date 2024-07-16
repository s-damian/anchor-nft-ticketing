import React, { useEffect, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
//import { getAnchorProgram } from "../utils/anchorUtils";
import { PublicKey } from "@solana/web3.js";
import { Connection, Commitment, clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Program, AnchorProvider, web3, Idl, setProvider } from "@coral-xyz/anchor";
import { Wallet } from "@coral-xyz/anchor/dist/cjs/provider";
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

            try {
                // Crée une nouvelle connexion à Solana avec l'URL du validateur et le niveau de commitment
                const connection = new Connection(network, opts.preflightCommitment);

                // Crée une instance de Provider
                const provider = new AnchorProvider(connection, wallet, opts);
                setProvider(provider);

                // Initialise le programme Anchor
                const program = new Program(idl as Idl, provider);

                //const test = await program.account.event.fetch(new PublicKey("8aZwxNmZTGGNJPE3ogp9qYqqaw4dvT6Y4v3NzL8ZHdC9"));
                //console.log(test);



                const accounts = await connection.getProgramAccounts(new PublicKey(idl.address));
                //console.log(accounts)





                /*accounts.forEach(({ pubkey, account }) => {
                    console.log(`Public Key: ${pubkey.toBase58()}`);
                    //const test1 = program.coder.accounts.decode('Event', account.data);
                    const test2 = program.account.event.fetch(pubkey);
                    //const test3 = program.account['event'].fetch(pubkey);

                    //console.log(program.coder.accounts)
                    console.log(program.account)
                    console.log('----------------------------');
                });*/





                const eventAccounts = await Promise.all(
                    accounts.map(async ({ pubkey, account }) => {
                        console.log(`Public Key : ${pubkey.toBase58()}`);

                        //const fetchedAccountData = await program.account.event.fetch(pubkey);
                        //console.log('Fetched account data:', fetchedAccountData);
                        console.log(program.account)
                        console.log(program.account.event)
                        console.log('----------------------------');
                        
                        
                        /*try {
                            // Essayez de décoder les données du compte avec coder
                            const eventAccountData = program.coder.accounts.decode('Event', account.data);
                            console.log('Decoded with coder:', eventAccountData);

                            // Essayez de décoder les données du compte avec fetch
                            const fetchedAccountData = await program.account.event.fetch(pubkey);
                            console.log('Fetched account data:', fetchedAccountData);

                            return {
                                publicKey: pubkey,
                                accountData: fetchedAccountData,
                            };
                        } catch (e) {
                            console.error('Failed to fetch or decode account data:', e);
                            return null;
                        }*/
                    })
                );




                /*const eventAccounts = accounts.map(({ pubkey, account }) => ({
                    publicKey: pubkey,
                    accountData: program.account.event.coder.accounts.decode('Event', account.data),
                }));*/

                //setEvents(eventAccounts);



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
