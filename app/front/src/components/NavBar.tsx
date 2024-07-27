"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FaBars, FaTimes } from "react-icons/fa";

const NavBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-blue-700 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <ul className="hidden md:flex justify-around items-center list-none p-0 m-0 w-full">
                    <li>
                        <Link href="/" className="text-white no-underline p-2 hover:text-yellow-300">
                            Accueil
                        </Link>
                    </li>
                    <li>
                        <Link href="/create-event" className="text-white no-underline p-2 hover:text-yellow-300">
                            Créer un Événement
                        </Link>
                    </li>
                    <li>
                        <Link href="/list-events" className="text-white no-underline p-2 hover:text-yellow-300">
                            Liste des Événements
                        </Link>
                    </li>
                    <li>
                        <Link href="/verify-nft" className="text-white no-underline p-2 hover:text-yellow-300">
                            Vérifier un NFT
                        </Link>
                    </li>
                    <li className="ml-auto">
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
                            Accueil
                        </Link>
                    </li>
                    <li className="w-full text-center">
                        <Link href="/create-event" className="block text-white no-underline p-2 hover:text-yellow-300" onClick={toggleMenu}>
                            Créer un Événement
                        </Link>
                    </li>
                    <li className="w-full text-center">
                        <Link href="/list-events" className="block text-white no-underline p-2 hover:text-yellow-300" onClick={toggleMenu}>
                            Liste des Événements
                        </Link>
                    </li>
                    <li className="w-full text-center">
                        <Link href="/verify-nft" className="block text-white no-underline p-2 hover:text-yellow-300" onClick={toggleMenu}>
                            Vérifier un NFT
                        </Link>
                    </li>
                    <li className="w-full text-center mt-4">
                        <WalletMultiButton />
                    </li>
                </ul>
            )}
        </nav>
    );
};

export default NavBar;
