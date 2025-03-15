import { useContext, useState } from 'react';
import { AppContext } from '../../store/app.context';
import PersonalCalendar from './PersonalCalendar';
import EventManager from './EventManager';
import { FaCog, FaBell, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authenticationService';

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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {appState.userData?.username}&apos;s Dashboard
          </h2>
        </div>
        <nav className="mt-6">
          <button
            className={`w-full flex items-center px-6 py-3 ${
              activeSection === 'calendar' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveSection('calendar')}
          >
            <FaCalendarAlt className="mr-3" />
            Calendar
          </button>
          <button
            className={`w-full flex items-center px-6 py-3 ${
              activeSection === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveSection('settings')}
          >
            <FaCog className="mr-3" />
            Settings
          </button>
          <button
            className="w-full flex items-center px-6 py-3 text-gray-600"
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
          <h1 className="text-2xl font-bold text-gray-800">
            {activeSection === 'calendar' ? 'My Calendar' : 'Settings'}
          </h1>
          <button className="p-2 rounded-full bg-gray-200">
            <FaBell className="text-gray-600" />
          </button>
        </header>

        <div className="grid grid-cols-3 gap-6">
          {activeSection === 'calendar' ? (
            <>
              <div className="col-span-2">
                <PersonalCalendar />
              </div>
              <div className="col-span-1">
                <EventManager />
              </div>
            </>
          ) : (
            <div className="col-span-3">
              {/* Settings content here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;