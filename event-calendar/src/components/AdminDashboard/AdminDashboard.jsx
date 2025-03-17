import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../store/app.context';
import AdminManagement from './AdminManagement';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalEvents: 0,
        activeEvents: 0,
        totalUsers: 0
    });
    const { appState } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/api/admin/stats', {
                    headers: {
                        'Authorization': `Bearer ${appState.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch statistics');
                }

                const data = await response.json();
                
                setStats({
                    totalEvents: data.events.total,
                    activeEvents: data.events.active,
                    totalUsers: data.users.total
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (appState.token) {
            fetchStats();
        }
    }, [appState.token]);

    if (loading) {
        return <div className="p-6">Loading statistics...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Events</h3>
                    <p className="text-2xl font-bold">{stats.totalEvents}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Active Events</h3>
                    <p className="text-2xl font-bold">{stats.activeEvents}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Users</h3>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
            </div>

            {/* Admin Management Section */}
            <AdminManagement />
        </div>
    );
};

export default AdminDashboard;