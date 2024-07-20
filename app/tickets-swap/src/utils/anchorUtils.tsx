import { Connection, Commitment, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Program, AnchorProvider, web3, Idl, setProvider } from "@coral-xyz/anchor";
import { Wallet } from "@coral-xyz/anchor/dist/cjs/provider";
import idl from "../idl/tickets_swap.json";

const { SystemProgram } = web3;

const getNetworkUrl = (network: string): string => {
    switch (network) {
        case "localnet":
            return "http://127.0.0.1:8899";
        case "devnet-custom-rpc":
            if (process.env.CUSTOM_RPC_URL) {
                return JSON.parse(process.env.CUSTOM_RPC_URL);
            }
            return clusterApiUrl(WalletAdapterNetwork.Devnet);
        case "devnet":
            return clusterApiUrl(WalletAdapterNetwork.Devnet);
        case "testnet":
            return clusterApiUrl(WalletAdapterNetwork.Testnet);
        case "mainnet":
            return clusterApiUrl(WalletAdapterNetwork.Mainnet);
        default:
            throw new Error(`Unsupported network: ${network}`);
    }
};

// Assurez-vous que les variables d'environnement sont définies.
if (!process.env.REACT_APP_SOLANA_NETWORK || !process.env.REACT_APP_SOLANA_COMMITMENT) {
    throw new Error("REACT_APP_SOLANA_NETWORK and REACT_APP_SOLANA_COMMITMENT must be defined");
}

const network = process.env.REACT_APP_SOLANA_NETWORK!; // URL du validateur local.

const networkUrl = getNetworkUrl(network); // URL du validateur.

const opts = {
    preflightCommitment: process.env.REACT_APP_SOLANA_COMMITMENT as Commitment,
};

export const getAnchorProgram = (wallet: Wallet) => {
    if (!wallet) {
        throw new Error("Wallet not connected");
    }

    // Crée une nouvelle connexion à Solana avec l'URL du validateur et le niveau de commitment.
    const connection = new Connection(networkUrl, opts.preflightCommitment);

    // Crée une instance de Provider.
    const provider = new AnchorProvider(connection, wallet, opts);
    setProvider(provider);

    // Initialise le programme Anchor.
    //const program = new Program(idl as Idl, provider); // for "@coral-xyz/anchor": "0.30.1"
    const program = new Program(idl as Idl, new PublicKey(idl.metadata.address), provider); // for "@coral-xyz/anchor": "0.29.0"

    return { program, provider, connection, SystemProgram };
};
