import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../../services/eventService";
import logo from "../../assets/logo.png";
import { GoTriangleDown } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../store/app.context";
import { getUserByEmail } from "../../services/usersService";
import { logout } from "../../services/authenticationService";

export default function NavBarPrivate() {
  const { appState, setAppState } = useContext(AppContext);
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

  const handleLogout = async () => {
    try {
      await logout();
      setAppState({
        user: null,
        userData: null,
        token: null,
      });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
      );

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
        <Link to="/home" className="flex-shrink-0">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
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

      <div className="flex items-center space-x-6">
        {appState.userData?.isAdmin && (
          <Link
            to="/admin-dashboard"
            className="text-[#DA4735] hover:text-[#c23e2e] font-medium text-sm transition-colors duration-200"
          >
            Admin Dashboard
          </Link>
        )}

        {/* Profile Dropdown */}
        <div className="relative group">
          <button className="flex items-center space-x-2 focus:outline-none">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#DA4735]">
              {profilePictureURL ? (
                <img
                  src={profilePictureURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <span className="text-xs">No Image</span>
                </div>
              )}
            </div>
            <GoTriangleDown className="text-gray-500 group-hover:text-[#DA4735] transition-colors duration-200" />
          </button>

          <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-1">
              <button
                onClick={() => navigate("/dashboard")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#DA4735] transition-colors duration-200"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate("/home/profile")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#DA4735] transition-colors duration-200"
              >
                Profile Details
              </button>
              <button
                onClick={() => navigate("/home/contact-lists")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#DA4735] transition-colors duration-200"
              >
                Contact Lists
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#DA4735] transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
