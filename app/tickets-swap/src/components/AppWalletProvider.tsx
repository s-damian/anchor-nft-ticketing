"use client";

import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { getNetworkUrl } from "../utils/anchorUtils";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

export default function AppWalletProvider({ children }: { children: React.ReactNode }) {
    const network = process.env.NEXT_PUBLIC_REACT_APP_SOLANA_NETWORK!;
    const networkUrl = getNetworkUrl(network);

    const wallets = [new PhantomWalletAdapter()];

    return (
        <ConnectionProvider endpoint={networkUrl}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
