import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../../services/eventService";
import logo from "../../assets/logo.png";
import { GoTriangleDown } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../store/app.context";
import { getUserByEmail } from "../../services/usersService";

export default function NavBarPrivate() {
    const { appState } = useContext(AppContext);
    const [profilePictureURL, setProfilePictureURL] = useState(null);   
    const [search, setSearch] = useState("");
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Event Calendar";
        fetch("/api/events");
        const fetchUserProfile = async () => {
          if (appState?.user && appState?.token) {
            try {
              const userData = await getUserByEmail(appState.user, appState.token);
              if (userData?.profilePictureURL) {
                setProfilePictureURL(userData.profilePictureURL);
              }
            } catch (error) {
              console.error("Error fetching user profile:", error);
            }
          }
        };
    
        fetchUserProfile();
      }, [appState]);

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
            .filter(event => event.startDate && new Date(event.startDate) >= currentDate);

        // Find the first recurring event after today
        const firstRecurringEvent = results.find(event => event.isRecurring === true);
    
        // Combine the first recurring event (if found) with the rest of the results
        const nonRecurringEvents = results.filter(event => event.isRecurring === false);
    
        setFilteredEvents(firstRecurringEvent ? [firstRecurringEvent, ...nonRecurringEvents] : nonRecurringEvents);
        console.log("Search Results:", { firstRecurringEvent, nonRecurringEvents });
    }, [search, events]);

    return (
        <nav className="navbar flex justify-center items-center bg-gray-500 p-6 relative sticky">
            <Link to="/home">
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
            {appState.userData?.isAdmin && (
            <li>
              {" "}
              <a href="/admin-dashboard" className="text-indigo-600">
                {" "}
                Admin Dashboard{" "}
              </a>{" "}
            </li>
          )}
            <div className="flex space-x-10">
                {/* Profile Dropdown */}
                          <details className="dropdown">
                            <summary className="btn btn-ghost rounded-full">
                              <div className="avatar">
                                <div className="w-12 rounded-full">
                                  {profilePictureURL ? (
                                    <img src={profilePictureURL} alt="User Profile" />
                                  ) : (
                                    <div className="bg-gray-400 w-full h-full flex items-center justify-center text-white">
                                      {/* Placeholder for missing profile picture */}
                                      <span className="text-sm">No Image</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <GoTriangleDown />{" "}
                            </summary>
                            <ul className="menu dropdown-content bg-base-100 rounded-box shadow-lg z-10 w-52 p-2">
                              <li>
                                <button onClick={() => navigate("/dashboard")}>Profile</button>
                              </li>{" "}
                              <li>
                                <button onClick={() => navigate("/home/profile")}>
                                  Profile Details
                                </button>
                              </li>
                              <li>
                                <button onClick={() => navigate("/home/contact-lists")}>
                                  My Contact Lists
                                </button>
                              </li>
                            </ul>
                          </details>

            </div>
        </nav>
    );
}