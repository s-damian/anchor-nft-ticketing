import React from "react";
import NavBar from "./NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const contextClass = {
        success: "bg-blue-600",
        error: "bg-red-600",
        info: "bg-gray-600",
        warning: "bg-orange-400",
        default: "bg-indigo-600",
        dark: "bg-white-600 font-gray-300",
    };

    return (
        <div className="container mx-auto text-center">
            <NavBar />
            <div className="min-h-screen bg-gray-100 flex flex-col py-12 px-8">
                {children}
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
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
            </div>
        </div>
    );
};

export default Layout;
