"use client";

import React from "react";
import Link from "next/link";
import Layout from "../src/components/Layout";

const Home: React.FC = () => {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center bg-gray-100">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Bienvenue sur notre plateforme d'événements et de NFTs</h1>
                <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
                    Notre plateforme, basée sur la blockchain Solana, permet aux organisateurs d'événements de créer des événements uniques et de vendre des
                    tickets sous forme de NFTs.
                </p>

                <div className="flex flex-wrap justify-center gap-8">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs">
                        <h3 className="text-xl font-bold text-indigo-600 mb-2">Créer un Événement</h3>
                        <p className="text-gray-600 mb-4">Organisez vos événements en quelques clics et mettez-les à disposition de votre audience.</p>
                        <Link
                            href="/create-event"
                            className="block text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                        >
                            Créer un Événement
                        </Link>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs">
                        <h3 className="text-xl font-bold text-indigo-600 mb-2">Liste des Événements</h3>
                        <p className="text-gray-600 mb-4">Découvrez tous les événements disponibles et participez à ceux qui vous intéressent.</p>
                        <Link
                            href="/list-events"
                            className="block text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                        >
                            Voir les Événements
                        </Link>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs">
                        <h3 className="text-xl font-bold text-indigo-600 mb-2">Vérifier un NFT</h3>
                        <p className="text-gray-600 mb-4">Assurez-vous de l'authenticité des NFTs associés à vos tickets d'événement.</p>
                        <Link
                            href="/verify-nft"
                            className="block text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                        >
                            Vérifier un NFT
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs">
                            <h4 className="text-xl font-bold text-indigo-600 mb-2">1. Créez votre événement</h4>
                            <p className="text-gray-600">Décrivez votre événement, fixez le prix des tickets et publiez-le sur notre plateforme.</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs">
                            <h4 className="text-xl font-bold text-indigo-600 mb-2">2. Vendez des tickets sous forme de NFTs</h4>
                            <p className="text-gray-600">Les participants achètent des tickets qui sont émis sous forme de NFTs uniques et vérifiables.</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs">
                            <h4 className="text-xl font-bold text-indigo-600 mb-2">3. Vérifiez l'authenticité des tickets</h4>
                            <p className="text-gray-600">
                                Utilisez notre outil de vérification pour vous assurer de l'authenticité des tickets lors de l'entrée à l'événement.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Rejoignez-nous dès maintenant !</h2>
                    <p className="text-lg text-gray-700 mb-8 max-w-2xl">
                        Que vous soyez un organisateur d'événements ou un participant, notre plateforme vous offre une expérience unique et sécurisée.
                    </p>
                    <Link
                        href="/create-event"
                        className="inline-block py-2 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                    >
                        Commencer
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
