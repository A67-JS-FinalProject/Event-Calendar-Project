import { useState, useContext, useEffect } from "react";
import {
  MdSearch,
  MdModeEdit,
  MdDeleteForever,
  MdLockOpen,
  MdOutlineLock,
} from "react-icons/md";
import EditEventModal from "./EditEventModal";
import { AppContext } from "../../store/app.context";
import { getAllUsers } from "../../services/usersService";
import { getAllEvents } from "../../services/eventService";
import { toggleBlockUser as toggleBlockUserService } from "../../services/usersService";
import {
  editEvent as editEventService,
  deleteEvent as deleteEventService,
  deleteRecurringEvents, // Ensure this is imported
} from "../../services/eventService";

const UserManagementDashboard = () => {
  const { token } = useContext(AppContext);

  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers(token);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await getAllEvents(token);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Toggle user block status
  const toggleBlockUser = async (email) => {
    try {
      await toggleBlockUserService(email);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === email ? { ...user, isBlocked: !user.isBlocked } : user
        )
      );
    } catch (error) {
      console.error("Error updating user block status:", error);
    }
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleSaveEvent = async (updatedEvent) => {
    try {
      await editEventService(selectedEvent._id, updatedEvent, token);
      setIsEditModalOpen(false);
      fetchEvents(); // Reload events after editing
    } catch (error) {
      console.error("Error editing event:", error);
    }
  };

  // Delete event
  const deleteEvent = async (eventId, isRecurring, seriesId) => {
    try {
      if (isRecurring && seriesId) {
        // Delete all events in the recurring series
        await deleteRecurringEvents(seriesId, token);
      } else {
        // Delete a single event
        await deleteEventService(eventId, token);
      }
      fetchEvents(); // Reload events after deleting
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Filter data based on search term
  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getUniqueEvents = (events) => {
    const uniqueEventsMap = new Map();
    events.forEach((event) => {
      const key = `${event.title}-${event.description}-${event.location}`;
      if (!uniqueEventsMap.has(key)) {
        uniqueEventsMap.set(key, event);
      }
    });
    return Array.from(uniqueEventsMap.values());
  };

  // Filter data based on search term and remove duplicates
  const filteredEvents = Array.isArray(events)
    ? getUniqueEvents(
        events.filter(
          (event) =>
            event.title &&
            event.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(
    activeTab === "users"
      ? filteredUsers.length / itemsPerPage
      : filteredEvents.length / itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "users"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("users")}
          >
            User Management
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "events"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("events")}
          >
            Event Management
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={`Search ${
                activeTab === "users"
                  ? "users by username, name, or email"
                  : "events by name"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "users" ? (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                User List
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.length > 0 ? (
                      currentUsers.map((user, index) => (
                        <tr key={`user-${user.email || index}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.isBlocked
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.isBlocked ? "Blocked" : "Active"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => toggleBlockUser(user.email)}
                              className={`mr-2 p-1 rounded ${
                                user.isBlocked
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                              title={
                                user.isBlocked ? "Unblock User" : "Block User"
                              }
                            >
                              {user.isBlocked ? (
                                <MdOutlineLock className="h-5 w-5" />
                              ) : (
                                <MdLockOpen className="h-5 w-5" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Event List
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recurring
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentEvents.length > 0 ? (
                      currentEvents.map((event) => (
                        <tr key={event._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {event.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.isRecurring ? "Yes" : "No"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              className="mr-2 p-1 bg-blue-100 text-blue-600 rounded"
                              title="Edit"
                              onClick={() => openEditModal(event)}
                            >
                              <MdModeEdit className="h-5 w-5" />
                            </button>
                            {isEditModalOpen && (
                              <EditEventModal
                                eventId={
                                  selectedEvent ? selectedEvent._id : null
                                }
                                onClose={() => setIsEditModalOpen(false)}
                                onSave={handleSaveEvent}
                              />
                            )}
                            <button
                              onClick={() =>
                                deleteEvent(
                                  event._id,
                                  event.isRecurring,
                                  event.seriesId
                                )
                              }
                              className="p-1 bg-red-100 text-red-600 rounded"
                              title="Delete"
                            >
                              <MdDeleteForever className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No events found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementDashboard;
