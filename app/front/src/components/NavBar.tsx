import React, { useState } from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FaBars, FaTimes } from "react-icons/fa";
import BalanceDisplay from "./wallet/BalanceDisplay";

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
                        <span className="text-yellow-300 p-2">
                            <BalanceDisplay />
                        </span>
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
                        <span className="text-yellow-300 p-2">
                            <BalanceDisplay />
                        </span>
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
