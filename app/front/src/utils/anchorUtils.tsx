import { Connection, Commitment, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Program, AnchorProvider, web3, Idl, setProvider } from "@coral-xyz/anchor";
import { Wallet } from "@coral-xyz/anchor/dist/cjs/provider";
import idl from "../idl/nft_ticketing.json";

const { SystemProgram } = web3;

// Assurez-vous que les variables d'environnement sont définies.
if (!process.env.NEXT_PUBLIC_REACT_APP_SOLANA_NETWORK || !process.env.NEXT_PUBLIC_REACT_APP_SOLANA_COMMITMENT) {
    throw new Error("NEXT_PUBLIC_REACT_APP_SOLANA_NETWORK and NEXT_PUBLIC_REACT_APP_SOLANA_COMMITMENT must be defined");
}

export const getNetworkUrl = (network: string): string => {
    switch (network) {
        case "localnet":
            return "http://127.0.0.1:8899";
        case "devnet-custom-rpc":
            return "http://127.0.0.1:8899";
        case "devnet":
            return "https://api.devnet.solana.com";
        case "testnet":
            return "https://api.testnet.solana.com";
        case "mainnet":
            return "https://api.mainnet-beta.solana.com";
        default:
            throw new Error(`Unsupported network: ${network}`);
    }
};

export const getNetworkAdapterUrl = (network: string): string => {
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

const network = process.env.NEXT_PUBLIC_REACT_APP_SOLANA_NETWORK!;
const networkUrl = getNetworkAdapterUrl(network); // URL du validateur.

const opts = {
    preflightCommitment: process.env.NEXT_PUBLIC_REACT_APP_SOLANA_COMMITMENT as Commitment,
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
    const program = new Program(idl as Idl, provider); // For "@coral-xyz/anchor" >= "0.30.0"
    //const program = new Program(idl as Idl, new PublicKey(idl.metadata.address), provider); // For "@coral-xyz/anchor" <= "0.29.0"

    return { program, provider, connection, SystemProgram };
};
