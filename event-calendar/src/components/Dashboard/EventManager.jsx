import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../store/app.context';
import { getUserEvents, getUpcomingEvents } from '../../services/eventService';
import { Link } from 'react-router-dom';

const EventManager = () => {
  const { appState } = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        if (filter === 'upcoming') {
          const upcomingEvents = await getUpcomingEvents(
            appState.user?.uid,
            appState.token
          );
          setEvents(upcomingEvents || []);
        } else {
          const userEvents = await getUserEvents(
            appState.user?.uid,
            appState.token
          );
          setEvents(userEvents || []);
        }
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
    const now = new Date();
    switch (filter) {
      case 'upcoming':
        return events.filter(event => new Date(event.startDate) >= now);
      case 'past':
        return events.filter(event => new Date(event.startDate) < now);
      case 'created':
        return events.filter(event => event.organizer === appState.user?.uid);
      default:
        return events;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Events</h2>
        <Link
          to="/create-an-event"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Event
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        {['upcoming', 'past', 'created'].map(filterOption => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-3 py-1 rounded capitalize ${
              filter === filterOption
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
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
              className="block p-4 border rounded hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">{event.location}</p>
                </div>
                {event.organizer === appState.user?.uid && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Organizer
                  </span>
                )}
              </div>
            </Link>
          ))}
          {getFilteredEvents().length === 0 && (
            <p className="text-center text-gray-500 py-4">No events found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventManager;