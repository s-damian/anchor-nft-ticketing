import React, { useState, useEffect } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { web3 } from "@coral-xyz/anchor";

const BalanceDisplay: React.FC = () => {
    const wallet = useAnchorWallet();
    const { connection } = useConnection();
    const [balanceInLamports, setBalanceInLamports] = useState<number | null>(null); // Balance in Lamports.

    useEffect(() => {
        const fetchBalance = async () => {
            if (wallet?.publicKey) {
                try {
                    const balance = await connection.getBalance(wallet.publicKey);
                    setBalanceInLamports(balance);
                } catch (error) {
                    console.error("Error fetching balance:", error);
                    setBalanceInLamports(null);
                }
            } else {
                setBalanceInLamports(null);
            }
        };

        fetchBalance();

        // Set up an interval to update the balance every 60 seconds.
        const intervalId = setInterval(fetchBalance, 60000);

        // Clean up the interval on component unmount.
        return () => clearInterval(intervalId);
    }, [wallet, connection]);

    if (!wallet?.publicKey || balanceInLamports === null) {
        return null;
    }

    const balanceInSol = balanceInLamports / web3.LAMPORTS_PER_SOL;

    return <span title={`${balanceInSol.toFixed(9)} SOL`}>{balanceInSol.toFixed(4)} SOL</span>;
};

export default BalanceDisplay;
