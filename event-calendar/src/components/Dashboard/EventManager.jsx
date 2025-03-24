import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../store/app.context';
import { getEventsByDateRange } from '../../services/eventService';
import { Link } from 'react-router-dom';
import CreateAnEvent from '../CreateAEvent/CreateAnEvent';

const EventManager = () => {
  const { appState } = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('upcoming');
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
          new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          appState.token
        );
        setEvents(Array.isArray(upcomingEvents) ? upcomingEvents : []);
      } catch (error) {
        console.error('Error fetching events:', error);
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
    const currentUserEmail = appState.user?.email; // Get the current user's email

    switch (filter) {
      case 'upcoming':
        return events.filter(event => new Date(event.startDate) > now);
      case 'past':
        return events.filter(event => new Date(event.startDate) < now);
      case 'created':
        // Only show events where the current user is the organizer
        return events.filter(event => 
          event.organizer === appState.user?.uid || 
          event.createdBy?.email === currentUserEmail
        );
      default:
        return events;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 relative">
      <div className="fixed inset-0 flex items-center justify-center z-50 w-50 h-20">
        <CreateAnEvent isOpen={isModalOpen} onRequestClose={closeModal} />
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">My Events</h2>
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          Create Event
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {['upcoming', 'past', 'created'].map(filterOption => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-3 py-1 rounded capitalize ${
              filter === filterOption
                ? 'bg-blue-500 text-white dark:bg-blue-600 dark:text-white'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
            }`}
          >
            {filterOption}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="space-y-4">
          {getFilteredEvents().map(event => (
            <Link
              key={event._id}
              to={`/event/${event._id}`}
              className="block p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {event.location}
                  </p>
                </div>
                {(event.organizer === appState.user?.uid || event.createdBy?.email === appState.user?.email) ? (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-500 dark:text-blue-100">
                    Organizer
                  </span>
                ) : (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded dark:bg-green-500 dark:text-green-100">
                    Invited
                  </span>
                )}
              </div>
            </Link>
          ))}
          {getFilteredEvents().length === 0 && (
            <p className="text-center text-gray-500 py-4 dark:text-gray-400">No events found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventManager;