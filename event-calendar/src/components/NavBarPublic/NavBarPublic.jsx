import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../../services/eventService";
import logo from "../../assets/logo.png";

export default function NavBarPublic() {
    const [search, setSearch] = useState("");
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEvents();
                if (Array.isArray(data)) {
                    setEvents(data);
                } else {
                    setEvents([]);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
                setEvents([]);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredEvents([]);
            return;
        }
    
        const currentDate = new Date();
    
        const results = events
            .filter(event => event.title.toLowerCase().includes(search.toLowerCase()))
            .filter(event => event.startDate && new Date(event.startDate) >= currentDate)
            .filter(event => event.isPublic === true);
    
        setFilteredEvents(results);
        console.log("Search Results:", results);
    }, [search, events]);

    return (
        <nav className="navbar flex justify-center items-center bg-gray-500 p-6 relative">
            <Link to="/">
                <img src={logo} alt="Logo" className="h-8" />
            </Link>
            <Link to="/login" className="btn btn-error text-white px-6 py-3 text-lg rounded-full mr-6">
                Events
            </Link>
            <div className="relative">
                <label className="input mr-6 flex items-center bg-white px-3 py-2 rounded-md shadow-sm">
                    <svg className="h-5 opacity-50 mr-2" viewBox="0 0 24 24">
                        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input
                        type="search"
                        placeholder="Search Events"
                        className="outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </label>
                {filteredEvents.length > 0 && (
                    <ul className="absolute top-12 left-0 w-full bg-white shadow-md rounded-md mt-1">
                        {filteredEvents.map((event) => (
                            <li key={event._id} className="px-4 py-2 hover:bg-gray-200">
                                <Link to={`/event/${event._id}`}>{event.title}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="flex space-x-10">
                <Link to="/login" className="btn btn-error text-white px-6 py-3 text-lg rounded-full">
                    Login
                </Link>
                <Link to="/register" className="btn btn-error text-white px-6 py-3 text-lg rounded-full">
                    Register
                </Link>
            </div>
        </nav>
    );
}