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
      .filter((event) =>
        event.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter(
        (event) => event.startDate && new Date(event.startDate) >= currentDate
      )
      .filter((event) => event.isPublic === true);

    const firstRecurringEvent = results.find(
      (event) => event.isRecurring === true
    );
    const nonRecurringEvents = results.filter(
      (event) => event.isRecurring === false
    );

    setFilteredEvents(
      firstRecurringEvent
        ? [firstRecurringEvent, ...nonRecurringEvents]
        : nonRecurringEvents
    );
  }, [search, events]);

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="flex items-center space-x-8">
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </Link>

        <Link
          to="/events"
          className="px-4 py-2 text-white bg-[#DA4735] rounded-lg hover:bg-[#c23e2e] transition-colors duration-200 font-medium text-sm"
        >
          Events
        </Link>

        {/* Search Bar */}
        <div className="relative w-64">
          <div className="relative flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-[#DA4735] focus-within:ring-1 focus-within:ring-[#DA4735] transition-all duration-200">
            <svg
              className="h-5 w-5 text-gray-400 mr-2"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="search"
              placeholder="Search events..."
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredEvents.length > 0 && (
            <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {filteredEvents.map((event) => (
                <Link
                  to={`/events/${event._id}`}
                  key={event._id}
                  className="flex items-center p-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-shrink-0 mr-3">
                    <img
                      src={event.eventCover}
                      alt={event.title}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.startDate).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 text-[#DA4735] border border-[#DA4735] rounded-lg hover:bg-[#DA4735] hover:text-white transition-colors duration-200 font-medium text-sm"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 text-white bg-[#DA4735] rounded-lg hover:bg-[#c23e2e] transition-colors duration-200 font-medium text-sm"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}
