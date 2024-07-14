import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import CreateTicket from "./pages/CreateTicket";
import SwapTicket from "./pages/SwapTicket";
import NavBar from "./components/NavBar";

export default function App() {
    return (
        <BrowserRouter>
            <div className="container mx-auto text-center">
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create-event" element={<CreateEvent />} />
                    <Route path="/create-ticket" element={<CreateTicket />} />
                    <Route path="/swap-ticket" element={<SwapTicket />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
