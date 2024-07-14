import { Connection, Commitment } from "@solana/web3.js";
import { Program, AnchorProvider, web3, Idl, setProvider } from "@coral-xyz/anchor";
import { Wallet } from "@coral-xyz/anchor/dist/cjs/provider";
import idl from "../idl/tickets_swap.json";

const { SystemProgram } = web3;
const network = "http://127.0.0.1:8899"; // URL du validateur local
const opts = {
    preflightCommitment: "confirmed" as Commitment,
};

export const getAnchorProgram = (wallet: Wallet) => {
    if (!wallet) {
        throw new Error("Wallet not connected");
    }

    // Crée une nouvelle connexion à Solana avec l'URL du validateur et le niveau de commitment
    const connection = new Connection(network, opts.preflightCommitment);

    // Crée une instance de Provider
    const provider = new AnchorProvider(connection, wallet, opts);
    setProvider(provider);

    // Initialise le programme Anchor
    const program = new Program(idl as Idl, provider);

    return { program, provider, connection, SystemProgram };
};
