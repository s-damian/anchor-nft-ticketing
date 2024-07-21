"use client";

import React from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const NavBar: React.FC = () => {
    return (
        <nav className="bg-blue-600 p-4">
            <ul className="flex justify-around items-center list-none p-0 m-0">
                <li>
                    <Link href="/" className="text-white no-underline p-2 hover:border-b-2 hover:border-gray-300">
                        Accueil
                    </Link>
                </li>
                <li>
                    <Link href="/create-event" className="text-white no-underline p-2 hover:border-b-2 hover:border-gray-300">
                        Créer un Événement
                    </Link>
                </li>
                <li>
                    <Link href="/list-events" className="text-white no-underline p-2 hover:border-b-2 hover:border-gray-300">
                        Liste des Événements
                    </Link>
                </li>
                <li className="ml-auto">
                    <WalletMultiButton style={{}} />
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;

// <WalletMultiButton className="btn btn-primary" />