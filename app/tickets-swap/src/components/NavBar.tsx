import React from "react";
import { NavLink } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "./NavBar.css";

const NavBar: React.FC = () => {
    return (
        <nav className="nav-bar">
            <ul>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/create-event">Create Event</NavLink>
                </li>
                <li>
                    <NavLink to="/swap-ticket">Swap Ticket</NavLink>
                </li>
                <li className="wallet-button">
                    <WalletMultiButton />
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;