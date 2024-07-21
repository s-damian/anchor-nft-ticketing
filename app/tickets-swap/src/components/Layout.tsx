import React from "react";
import NavBar from "./NavBar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="container mx-auto text-center">
            <NavBar />
            <div className="min-h-screen bg-gray-100 flex flex-col py-12 px-8">
                {children}
            </div>
        </div>
    );
};

export default Layout;
