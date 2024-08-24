import React from "react";
import { useConnection } from "@solana/wallet-adapter-react";

const NetworkName: React.FC = () => {
    const { connection } = useConnection();

    // Détermine le nom du réseau en fonction de l'URL du cluster.
    let network = "Unknown";
    const endpoint = connection.rpcEndpoint.toLowerCase();

    if (endpoint.includes("127.0.0.1") || endpoint.includes("localhost") || endpoint.includes("localnet")) {
        network = "Localnet";
    } else if (endpoint.includes("devnet")) {
        network = "Devnet";
    } else if (endpoint.includes("testnet")) {
        network = "Testnet";
    } else if (endpoint.includes("mainnet")) {
        network = "Mainnet";
    }

    return <span>{network}</span>;
};

export default NetworkName;
