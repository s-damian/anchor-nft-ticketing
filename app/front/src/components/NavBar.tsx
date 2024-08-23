import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { web3 } from "@coral-xyz/anchor";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FaBars, FaTimes } from "react-icons/fa";

const NavBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const wallet = useAnchorWallet();
    const { connection } = useConnection();
    const [balanceInSol, setBalanceInSol] = useState<number | null>(null); // Balance in SOL.

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const fetchBalance = async () => {
            if (wallet?.publicKey) {
                try {
                    const balance = await connection.getBalance(wallet.publicKey);
                    setBalanceInSol(balance / web3.LAMPORTS_PER_SOL);
                } catch (error) {
                    console.error("Error fetching balance:", error);
                    setBalanceInSol(null);
                }
            } else {
                setBalanceInSol(null);
            }
        };

        fetchBalance();

        // Set up an interval to update the balance every 60 seconds.
        const intervalId = setInterval(fetchBalance, 60000);

        // Clean up the interval on component unmount.
        return () => clearInterval(intervalId);
    }, [wallet, connection]);

    return (
        <nav className="bg-blue-700 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <ul className="hidden md:flex justify-around items-center list-none p-0 m-0 w-full">
                    <li>
                        <Link href="/" className="text-white no-underline p-2 hover:text-yellow-300">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/create-event" className="text-white no-underline p-2 hover:text-yellow-300">
                            Create an Event
                        </Link>
                    </li>
                    <li>
                        <Link href="/list-events" className="text-white no-underline p-2 hover:text-yellow-300">
                            List of Events
                        </Link>
                    </li>
                    <li>
                        <Link href="/verify-nft" className="text-white no-underline p-2 hover:text-yellow-300">
                            Verify an NFT
                        </Link>
                    </li>
                    <li className="ml-auto">
                        {wallet?.publicKey && balanceInSol !== null ? <span className="text-yellow-300 p-2">{balanceInSol.toFixed(4)} SOL</span> : null}
                    </li>
                    <li>
                        <WalletMultiButton style={{}} />
                    </li>
                </ul>
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>
            {isOpen && (
                <ul className="md:hidden flex flex-col items-center list-none p-0 m-0 bg-blue-600">
                    <li className="w-full text-center">
                        <Link href="/" className="block text-white no-underline p-2 hover:text-yellow-300" onClick={toggleMenu}>
                            Home
                        </Link>
                    </li>
                    <li className="w-full text-center">
                        <Link href="/create-event" className="block text-white no-underline p-2 hover:text-yellow-300" onClick={toggleMenu}>
                            Create an Event
                        </Link>
                    </li>
                    <li className="w-full text-center">
                        <Link href="/list-events" className="block text-white no-underline p-2 hover:text-yellow-300" onClick={toggleMenu}>
                            List of Events
                        </Link>
                    </li>
                    <li className="w-full text-center">
                        <Link href="/verify-nft" className="block text-white no-underline p-2 hover:text-yellow-300" onClick={toggleMenu}>
                            Verify an NFT
                        </Link>
                    </li>
                    <li className="w-full text-center mt-4">
                        {wallet?.publicKey && balanceInSol !== null ? <span className="text-yellow-300 p-2">{balanceInSol.toFixed(4)} SOL</span> : null}
                    </li>
                    <li className="w-full text-center mt-2 mb-2">
                        <WalletMultiButton />
                    </li>
                </ul>
            )}
        </nav>
    );
};

export default NavBar;
