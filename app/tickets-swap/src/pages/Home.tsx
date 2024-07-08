import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <h2>Welcome to the Event Tickets Marketplace</h2>
            <Link to="/event/create">Create an Event</Link>
        </div>
    );
}

export default Home;
