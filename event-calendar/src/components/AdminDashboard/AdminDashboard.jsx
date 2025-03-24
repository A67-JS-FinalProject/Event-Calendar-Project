import { useContext, useState } from 'react';
import { AppContext } from '../../store/app.context';
import { FaCog, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { appState, setAppState } = useContext(AppContext);
  const [activeSection, setActiveSection] = useState('calendar');
  const navigate = useNavigate();

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
        {/* ... rest of your main content ... */}
      </div>
    </div>
  );
};

export default UserDashboard;