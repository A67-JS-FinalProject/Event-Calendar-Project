import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../store/app.context";
import { getEventsByDateRange } from "../../services/eventService";
import { Link } from "react-router-dom";
import CreateAnEvent from "../CreateAEvent/CreateAnEvent";

const EventManager = () => {
  const { appState } = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            onClick={() => setFilter(filterOption)}
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
          {getFilteredEvents().map((event) => {
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
          {getFilteredEvents().length === 0 && (
            <p className="text-center text-gray-500 py-8">No events found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventManager;
