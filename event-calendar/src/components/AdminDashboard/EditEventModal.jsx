import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  getEventById,
  getEvents,
  editEvent,
} from "../../services/eventService"; // Import necessary services

const EditEventModal = ({ eventId, onClose, onSave }) => {
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    if (!eventId) return;

    const fetchEventData = async () => {
      try {
        const eventData = await getEventById(eventId);
        setFormData(eventData);
        setOriginalData(eventData);

        const events = await getEvents(); // Fetch all events
        setAllEvents(events);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Find all events with the same title, description, and location
      const matchingEvents = allEvents.filter(
        (event) =>
          event.title === originalData.title &&
          event.description === originalData.description &&
          event.location === originalData.location
      );

      if (matchingEvents.length > 0) {
        // Update all matching events in the database
        for (const event of matchingEvents) {
          await editEvent(event._id, formData); // Update each matching event
        }

        console.log(`Updated ${matchingEvents.length} events successfully.`);
        onSave(formData); // Notify parent component about the changes
      } else {
        console.log("No matching events found to update.");
      }
    } catch (error) {
      console.error("Error updating events:", error);
    }
  };

  if (!formData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Event</h2>
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="mb-4">
            <label htmlFor="title" className="block mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Location Input */}
          <div className="mb-4">
            <label htmlFor="location" className="block mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label htmlFor="description" className="block mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Is Public Checkbox */}
          <div className="mb-4 flex items-center">
            <input
              id="isPublic"
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) =>
                setFormData({ ...formData, isPublic: e.target.checked })
              }
              className="mr-2"
            />
            <label htmlFor="isPublic">Public Event</label>
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditEventModal.propTypes = {
  eventId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditEventModal;
