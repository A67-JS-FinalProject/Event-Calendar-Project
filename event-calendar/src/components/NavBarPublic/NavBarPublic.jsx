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
    
        // Find the first recurring event after today
        const firstRecurringEvent = results.find(event => event.isRecurring === true);
    
        // Combine the first recurring event (if found) with the rest of the results
        const nonRecurringEvents = results.filter(event => event.isRecurring === false);
    
        setFilteredEvents(firstRecurringEvent ? [firstRecurringEvent, ...nonRecurringEvents] : nonRecurringEvents);
        console.log("Search Results:", { firstRecurringEvent, nonRecurringEvents });
    }, [search, events]);

    return (
        <nav className="navbar flex justify-center items-center bg-gray-500 p-6 relative">
            <Link to="/">
                <img src={logo} alt="Logo" className="h-8" />
            </Link>
            <Link to="/events" className="btn btn-error text-white px-6 bg-[#DA4735] py-3 text-lg rounded-full mr-6">
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
                            <Link to={`/events/${event._id}`} key={event._id}>
                            <li className="px-4 py-2 hover:bg-gray-200">
                                
                                <div className="avatar">
                                    <div className="w-8 rounded">
                                        <img
                                            src={event.eventCover}
                                            alt="Tailwind-CSS-Avatar-component" />
                                    </div>
                                </div>
                                <p>{event.title}</p>
                                <p>{new Date(event.startDate).toLocaleString()}</p>
                            </li>
                            </Link>
                        ))}
                    </ul>
                )}
            </div>
            <div className="flex space-x-10">
                <Link to="/login" className="btn bg-[#DA4735] btn-error text-white px-6 py-3 text-lg rounded-full">
                    Login
                </Link>
                <Link to="/register" className="btn bg-[#DA4735]  btn-error text-white px-6 py-3 text-lg rounded-full">
                    Register
                </Link>
            </div>
        </nav>
    );
}
