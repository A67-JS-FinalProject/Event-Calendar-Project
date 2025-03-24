import { Link } from 'react-router-dom';
import logo from "../../assets/logo.png";

export default function NavBarPublic({ isAdmin }) {
    return (
        <nav className="navbar flex justify-center items-center bg-gray-500 p-6">
            <Link to="/" >
             <img src={logo} alt="Logo" className="h-8" />
             </Link>
            <Link to="/login" className="btn btn-error text-white px-6 py-3 text-lg rounded-full mr-6">
                About Us
            </Link>
            <label className="input mr-6">
                <svg className="h-[1em] opacity-50" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
                <input type="search" required placeholder="Search Events" />
            </label>
            <div className="flex space-x-10">
                <Link to="/login" className="btn btn-error text-white px-6 py-3 text-lg rounded-full">
                    Login
                </Link>
                <Link to="/register" className="btn btn-error text-white px-6 py-3 text-lg rounded-full">
                    Register
                </Link>
                {isAdmin && (
                    <Link to="/admin/dashboard" className="admin-button">
                        Admin Dashboard
                    </Link>
                )}
            </div>
        </nav>
    );
}