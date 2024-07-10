import React from "react";
import { NavLink } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function NavBar() {
    return (
        <nav className="bg-blue-600 p-4">
            <ul className="flex justify-around items-center list-none p-0 m-0">
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `text-white no-underline p-2 ${isActive ? "border-b-2 border-white" : "hover:border-b-2 hover:border-gray-300"}`
                        }
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/create-event"
                        className={({ isActive }) =>
                            `text-white no-underline p-2 ${isActive ? "border-b-2 border-white" : "hover:border-b-2 hover:border-gray-300"}`
                        }
                    >
                        Create Event
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/swap-ticket"
                        className={({ isActive }) =>
                            `text-white no-underline p-2 ${isActive ? "border-b-2 border-white" : "hover:border-b-2 hover:border-gray-300"}`
                        }
                    >
                        Swap Ticket
                    </NavLink>
                </li>
                <li className="ml-auto">
                    <WalletMultiButton className="btn btn-primary" />
                </li>
            </ul>
        </nav>
    );
};
