import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../store/app.context';
import '../styles/Navigation.css';

const Navigation = () => {
  const { appState } = useContext(AppContext);
  const isAdmin = appState.userData?.role === 'admin';

  return (
    <nav>
      {/* Regular navigation items */}
      <Link to="/">Home</Link>
      <Link to="/events">Events</Link>
      
      {/* Admin-only buttons */}
      {isAdmin && (
        <>
          <Link to="/admin/events/create" className="admin-button">Create Event</Link>
          <Link to="/admin/dashboard" className="admin-button">Admin Dashboard</Link>
          <Link to="/admin/users" className="admin-button">Manage Users</Link>
        </>
      )}
    </nav>
  );
};

export default Navigation;
