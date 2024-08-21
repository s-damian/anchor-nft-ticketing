import React from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import ClientOnly from "./ClientOnly";
import NavBar from "./NavBar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const wallet = useAnchorWallet();

    const contextClass = {
        success: "bg-blue-600",
        error: "bg-red-600",
        info: "bg-gray-600",
        warning: "bg-orange-400",
        default: "bg-indigo-600",
        dark: "bg-white-600 font-gray-300",
    };

    return (
        <div className="container mx-auto text-center flex flex-col min-h-screen">
            <ClientOnly>
                <NavBar />
                <div className="flex-grow bg-gray-100 flex flex-col py-12 px-8">
                    {wallet?.publicKey ? (
                        <>
                            {children}
                            <ToastContainer
                                position="top-right"
                                autoClose={5000}
                                hideProgressBar={true}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                toastClassName={(context) => contextClass[context?.type || "default"] + " overflow-hidden"}
                                bodyClassName={() => "text-sm font-white font-med block p-3"}
                                className="toast-container"
                            />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                            <p className="text-xl text-gray-800 mb-4">Veuillez connecter votre portefeuille pour continuer.</p>
                        </div>
                    )}
                </div>
            </ClientOnly>
            <footer className="bg-blue-800 text-white py-4">
                <p>
                    &copy; {new Date().getFullYear()} |{" "}
                    <Link href="https://github.com/s-damian/anchor-nft-ticketing" className="hover:text-yellow-300" target="_blank">
                        Anchor NFT Ticketing
                    </Link>
                </p>
            </footer>
        </div>
    );
};

export default Layout;
