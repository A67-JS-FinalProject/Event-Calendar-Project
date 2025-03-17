import { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../../store/app.context';
import { searchEvents, editEvent, deleteEvent } from '../../services/adminService';
import EditEventModal from './EditEventModal';

const AdminManagement = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { appState } = useContext(AppContext);

  const handleSearch = useCallback(async () => {
    try {
      const result = await searchEvents({ query: searchQuery }, appState.token);
      setEvents(result);
    } catch (error) {
      console.error('Error searching events:', error);
    }
  }, [searchQuery, appState.token]);

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery, handleSearch]);

  const handleEdit = async (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id, appState.token);
        setEvents(events.filter(event => event._id !== id));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="border-b">
                <td className="px-4 py-2">{event.title}</td>
                <td className="px-4 py-2">
                  {new Date(event.startDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{event.location}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          onClose={() => setIsEditModalOpen(false)}
          onSave={async (updatedEvent) => {
            try {
              await editEvent(selectedEvent._id, updatedEvent, appState.token);
              setEvents(events.map(e => 
                e._id === selectedEvent._id ? { ...e, ...updatedEvent } : e
              ));
              setIsEditModalOpen(false);
            } catch (error) {
              console.error('Error updating event:', error);
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminManagement;