import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import ListEvents from "./pages/ListEvents";
import CreateTicket from "./pages/CreateTicket";
import SwapTicket from "./pages/SwapTicket";
import NavBar from "./components/NavBar";

export default function App() {
    return (
        <BrowserRouter>
            <div className="container mx-auto text-center">
                <NavBar />
                <div className="bg-gray-100 py-12 px-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/create-event" element={<CreateEvent />} />
                        <Route path="/list-events" element={<ListEvents />} />
                        <Route path="/create-ticket" element={<CreateTicket />} />
                        <Route path="/swap-ticket" element={<SwapTicket />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}
