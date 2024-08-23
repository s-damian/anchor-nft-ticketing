"use client";

import React from "react";
import Link from "next/link";
import Layout from "../src/components/Layout";

const Home: React.FC = () => {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center bg-gray-100">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to our Event and NFT Platform</h1>
                <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
                    Our platform, based on the <strong>Solana blockchain</strong>, allows event organizers to create unique events and sell tickets in the form
                    of NFTs.
                </p>

                <div className="flex flex-wrap justify-center gap-8">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs">
                        <h3 className="text-xl font-bold text-indigo-600 mb-2">Create an Event</h3>
                        <p className="text-gray-600 mb-4">Organize your events in just a few clicks and make them available to your audience.</p>
                        <Link
                            href="/create-event"
                            className="block text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                        >
                            Create an Event
                        </Link>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs">
                        <h3 className="text-xl font-bold text-indigo-600 mb-2">List of Events</h3>
                        <p className="text-gray-600 mb-4">Explore a wide range of events and easily find the ones that capture your interest.</p>
                        <Link
                            href="/list-events"
                            className="block text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                        >
                            View Events
                        </Link>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs">
                        <h3 className="text-xl font-bold text-indigo-600 mb-2">Verify an NFT</h3>
                        <p className="text-gray-600 mb-4">Ensure the authenticity of NFTs linked to your event tickets with our verification tool.</p>
                        <Link
                            href="/verify-nft"
                            className="block text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                        >
                            Verify an NFT
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">How does it work?</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs">
                            <h4 className="text-xl font-bold text-indigo-600 mb-2">1. Create your event</h4>
                            <p className="text-gray-600">Create your unique event, set the ticket prices, and seamlessly publish it on our platform.</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs">
                            <h4 className="text-xl font-bold text-indigo-600 mb-2">2. Sell tickets as NFTs</h4>
                            <p className="text-gray-600">Allow participants to purchase tickets issued as unique and fully verifiable NFTs.</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs">
                            <h4 className="text-xl font-bold text-indigo-600 mb-2">3. Verify ticket authenticity</h4>
                            <p className="text-gray-600">Use our verification tool to ensure the authenticity of tickets at the event entrance.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Join us now!</h2>
                    <p className="text-lg text-gray-700 mb-8 max-w-2xl">
                        Whether you're an event organizer or a participant, our platform offers you a unique and secure experience.
                    </p>
                    <Link
                        href="/create-event"
                        className="inline-block py-2 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
