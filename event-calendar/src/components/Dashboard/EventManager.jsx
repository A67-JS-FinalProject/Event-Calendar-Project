import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../store/app.context";
import { getEventsByDateRange } from "../../services/eventService";
import { Link } from "react-router-dom";
import CreateAnEvent from "../CreateAEvent/CreateAnEvent";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoMdArrowRoundForward } from "react-icons/io";

const EventManager = () => {
  const { appState } = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5); // Number of events per page

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const upcomingEvents = await getEventsByDateRange(
          new Date().toISOString(),
          new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ).toISOString(),
          appState.token
        );
        setEvents(Array.isArray(upcomingEvents) ? upcomingEvents : []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    if (appState.token && appState.user) {
      fetchEvents();
    }
  }, [filter, appState.token, appState.user]);

  const getFilteredEvents = () => {
    if (!events) return [];

    const now = new Date();

    switch (filter) {
      case "upcoming":
        return events.filter((event) => new Date(event.startDate) > now);
      case "past":
        return events.filter((event) => new Date(event.startDate) < now);
      case "created":
        return events.filter(
          (event) =>
            event.organizer === appState.user?.uid ||
            event.createdBy?.email === appState.user?.email
        );
      default:
        return events;
    }
  };

  // Get current events for pagination
  const filteredEvents = getFilteredEvents();
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full p-4 h-fit">
      <div className="fixed inset-0 flex items-center justify-center z-50 w-50 h-fit">
        <CreateAnEvent isOpen={isModalOpen} onRequestClose={closeModal} />
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Events</h2>
        <button
          onClick={openModal}
          className="px-4 py-2 bg-[#DA4735] text-white rounded-lg hover:bg-[#c23e2e] transition-colors duration-200 font-medium"
        >
          Create Event
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {["upcoming", "past", "created"].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => {
              setFilter(filterOption);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg capitalize text-sm font-medium transition-colors duration-200 ${
              filter === filterOption
                ? "bg-[#DA4735] text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {filterOption}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading events...</div>
      ) : (
        <div className="space-y-3">
          {currentEvents.map((event) => {
            const isCreator = event.createdBy?.email === appState.user?.email;
            const isInvited = event.participants?.some(
              (participant) =>
                participant.email === appState.user?.email &&
                participant.status === "accepted" &&
                participant.role !== "organizer"
            );

            return (
              <Link
                key={event._id}
                to={`/event/${event._id}`}
                className="block p-5 border border-gray-200 rounded-lg hover:border-[#DA4735] transition-colors duration-200 hover:shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(event.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {event.location}
                    </p>
                  </div>
                  <div>
                    <div className="flex gap-2">
                      {isCreator && (
                        <span className="text-xs px-2 py-1 rounded bg-[#DA4735] bg-opacity-10 text-[#DA4735] font-medium">
                          Organizer
                        </span>
                      )}
                      {!isCreator && isInvited && (
                        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 font-medium">
                          Invited
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {filteredEvents.length === 0 && (
            <p className="text-center text-gray-500 py-8">No events found</p>
          )}

          {/* Pagination controls */}
          {filteredEvents.length > eventsPerPage && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-lg shadow-md">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-l-lg transition-colors duration-200
          ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
                >
                  <IoMdArrowRoundBack className="text-xl" />
                </button>
                {Array.from({
                  length: Math.ceil(filteredEvents.length / eventsPerPage),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 transition-colors duration-200
            ${
              currentPage === index + 1
                ? "bg-[#DA4735]  text-white font-semibold"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredEvents.length / eventsPerPage)
                  }
                  className={`px-4 py-2 rounded-r-lg transition-colors duration-200
          ${
            currentPage === Math.ceil(filteredEvents.length / eventsPerPage)
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
                >
                  <IoMdArrowRoundForward className="text-xl" />
                </button>
              </nav>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventManager;
