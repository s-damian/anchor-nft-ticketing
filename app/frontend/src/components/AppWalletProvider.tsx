"use client";

import React from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { getNetworkAdapterUrl } from "../utils/anchorUtils";
require("@solana/wallet-adapter-react-ui/styles.css");

const AppWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const networkUrl = getNetworkAdapterUrl(process.env.NEXT_PUBLIC_REACT_APP_SOLANA_NETWORK!);

    const wallets = [new PhantomWalletAdapter()];

    return (
        <ConnectionProvider endpoint={networkUrl}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default AppWalletProvider;
