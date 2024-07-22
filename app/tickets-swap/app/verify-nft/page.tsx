"use client";

import React, { useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import Layout from "../../src/components/Layout";
import { handleVerifyNft } from "../../src/handlers/HandleVerifyNft";

const VerifyNft: React.FC = () => {
    const [eventPublicKey, setEventPublicKey] = useState<string>("");
    const [nftPublicKey, setNftPublicKey] = useState<string>("");
    const wallet = useAnchorWallet();

    return (
        <Layout>
            <div className="flex items-center justify-center">
                <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">Vérifier un NFT</h2>
                    <form className="space-y-6" onSubmit={(e) => handleVerifyNft(e, nftPublicKey, eventPublicKey, wallet)}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <input
                                    id="eventPublicKey"
                                    name="eventPublicKey"
                                    type="text"
                                    value={eventPublicKey}
                                    onChange={(e) => setEventPublicKey(e.target.value)}
                                    required
                                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md sm:text-sm"
                                    placeholder="PublicKey de l'événement"
                                />
                            </div>
                            <div>
                                <input
                                    id="nftPublicKey"
                                    name="nftPublicKey"
                                    type="text"
                                    value={nftPublicKey}
                                    onChange={(e) => setNftPublicKey(e.target.value)}
                                    required
                                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md sm:text-sm"
                                    placeholder="PublicKey du NFT"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Vérifier le NFT
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default VerifyNft;
