import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../store/app.context';
import PersonalCalendar from '../Dashboard/PersonalCalendar'; // Fixed import path
import EventManager from '../Dashboard/EventManager'; // Fixed import path
import EventInvitationsList from '../Events/EventInvitationsList';
import { FaCog, FaCalendarAlt, FaSignOutAlt, FaSearch, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authenticationService';

const AdminDashboard = () => {
  const { appState } = useContext(AppContext);
  const [activeSection, setActiveSection] = useState('calendar');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleLogout = async () => {
    try {
      await logout();
      setAppState({
        user: null,
        userData: null,
        token: null,
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${appState.token}`
        }
      });
      
      if (response.ok) {
        setEvents(events.filter(event => event._id !== eventId));
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg dark:bg-gray-800">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {appState.userData?.username}&apos;s Dashboard
          </h2>
        </div>
        <nav className="mt-6">
          <button
            className={`w-full flex items-center px-6 py-3 ${
              activeSection === 'calendar' ? 'bg-blue-50 text-blue-600 dark:bg-blue-800 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setActiveSection('calendar')}
          >
            <FaCalendarAlt className="mr-3" />
            Calendar
          </button>

          {/* Admin Dashboard button - visible only if user is admin */}
          {appState.userData?.isAdmin && (
            <button
              className="w-full flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => navigate('/admin')}
            >
              <FaCog className="mr-3" />
              Admin Dashboard
            </button>
          )}

          <button
            className={`w-full flex items-center px-6 py-3 ${
              activeSection === 'settings' ? 'bg-blue-50 text-blue-600 dark:bg-blue-800 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setActiveSection('settings')}
          >
            <FaCog className="mr-3" />
            Settings
          </button>

          <button
            className="w-full flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {activeSection === 'calendar' ? 'My Calendar' : 'Admin Event Management'}
          </h1>
        </header>

        {activeSection === 'calendar' ? (
          // ...existing calendar view code...
          <>
            <div className="col-span-2">
              <PersonalCalendar />
            </div>
            <div className="col-span-1">
              <EventManager />
              <EventInvitationsList />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
            {/* Search and Filter Section */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Events Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Event Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Organizer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {filteredEvents.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(event.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event.createdBy.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate(`/events/${event._id}/edit`)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Edit event"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete event"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeSection === 'calendar' && !isLoading && (
          <div className="col-span-3 text-center">No events found</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;