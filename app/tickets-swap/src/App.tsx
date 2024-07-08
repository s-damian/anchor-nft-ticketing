import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import SwapTicket from "./pages/SwapTicket";
import "./App.css";
import NavBar from "./components/NavBar";

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create-event" element={<CreateEvent />} />
                    <Route path="/swap-ticket" element={<SwapTicket />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
