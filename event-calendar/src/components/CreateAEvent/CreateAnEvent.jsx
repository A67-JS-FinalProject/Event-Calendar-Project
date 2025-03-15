import { useState, useContext, useEffect } from "react";
import { createEvent } from "../../services/eventService";
import { AppContext } from "../../store/app.context";
import { getUserByEmail } from "../../services/usersService";

function CreateAnEvent({ isOpen, onRequestClose }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState("");
  const [tags, setTags] = useState("");
  const [reminders, setReminders] = useState("");
  const [userData, setUserData] = useState(null);

  const { appState, setAppState } = useContext(AppContext);
  const { user, token } = appState;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const authUser = await getUserByEmail(user, token);
        setUserData(authUser);
        console.log("Fetched user data:", authUser);
      }
    };

    fetchUserData();
  }, [user, token]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!userData) {
      console.error("User data not available");
      return;
    }

    try {
      const event = {
        title,
        startDate,
        endDate,
        location,
        description,
        participants: participants.split(","),
        isPublic,
        isRecurring,
        coverPhoto,
        tags: tags.split(","),
        reminders: reminders.split(","),
        createdBy: {
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
      };
      const createdEvent = await createEvent(event, token);

      if (!createdEvent) {
        console.error("Event creation failed");
        return;
      }

      setAppState((prevState) => ({
        ...prevState,
        events: Array.isArray(prevState.events)
          ? [...prevState.events, createdEvent]
          : [createdEvent],
      }));

      onRequestClose();
    } catch (error) {
      console.error("Error during event creation:", error.message);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center ">
      <div className="bg-black p-6 rounded-lg shadow-md w-96">
        <button onClick={onRequestClose} className=" text-red-500">
          X
        </button>
        <form className="flex flex-col " onSubmit={handleCreateEvent}>
          <h2 className="text-2xl font-bold mb-4 text-center">Create Event</h2>
          <label className="mb-2 flex flex-col">
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="mb-2 p-2 border rounded"
            />
          </label>
          <label className="mb-2 flex flex-col">
            Start Date
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              className="mb-2 p-2 border rounded"
            />
          </label>
          <label className="mb-2 flex flex-col">
            End Date
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              className="mb-2 p-2 border rounded"
            />
          </label>
          <label className="mb-2 flex flex-col">
            Location
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="mb-2 p-2 border rounded"
            />
          </label>
          <label className="mb-2 flex flex-col">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="mb-2 p-2 border rounded"
            />
          </label>
          <label className="mb-2 flex flex-col">
            Participants (comma separated)
            <input
              type="text"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Participants (comma separated)"
              className="mb-2 p-2 border rounded"
            />
          </label>
          <label className="mb-2 flex flex-col">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Public Event
          </label>
          <label className="mb-2 flex flex-col">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            Recurring Event
          </label>
          <label className="mb-2 flex flex-col">
            Cover Photo URL
            <input
              type="text"
              value={coverPhoto}
              onChange={(e) => setCoverPhoto(e.target.value)}
              placeholder="Cover Photo URL"
              className="mb-2 p-2 border rounded"
            />
          </label>
          <label className="mb-2 flex flex-col">
            Tags (comma separated)
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="mb-2 p-2 border rounded"
            />
          </label>
          <label className="mb-2 flex flex-col">
            Reminders (comma separated)
            <input
              type="text"
              value={reminders}
              onChange={(e) => setReminders(e.target.value)}
              placeholder="Reminders (comma separated)"
              className="mb-2 p-2 border rounded"
            />
          </label>
          <button type="submit" className="p-2 bg-blue-500 text-black rounded">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAnEvent;
