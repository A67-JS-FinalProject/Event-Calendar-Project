import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../store/app.context';
import { searchEvents, editEvent, deleteEvent } from '../../services/adminService';
import EditEventModal from './EditEventModal';

const AdminManagement = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { appState } = useContext(AppContext);

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      const result = await searchEvents({ query: searchQuery }, appState.token);
      setEvents(result);
    } catch (error) {
      console.error('Error searching events:', error);
    }
  };

  const handleEdit = (event) => {
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
        <table className="min-w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>{new Date(event.startDate).toLocaleDateString()}</td>
                <td>{event.location}</td>
                <td>
                  <button onClick={() => handleEdit(event)} className="mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(event._id)}>
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