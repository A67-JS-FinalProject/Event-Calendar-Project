import { useState } from "react";
const Profile = () => {

    const [user, setUser] = useState({
        firstName: "Martin",
        lastName: "Mesechkov",
        username: "martinmesechkov",
        email: "test01@gmail.com",
        phone: "0886957334",
        profilePictureURL: "https://res.cloudinary.com/dglknhf3r/image/upload/v1741793969/default-profile-account-unknown-icon-black-silhouette-free-vector_nluuwb.jpg",
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">User Profile</h2>

            <div className="avatar flex justify-center">
                <div className="w-24 rounded-full border-1 border-black">
                    <img className="item-center" src={user.profilePictureURL} />
                </div>
            </div>

            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
                type="text"
                name="name"
                value={user.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                placeholder="Enter name"
            />

            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
                type="text"
                name="name"
                value={user.lastName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                placeholder="Enter name"
            />

             <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
                type="text"
                name="name"
                value={user.username}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                placeholder="Enter name"
            />

            <label className="block text-sm font-medium text-gray-700 mt-3">Email</label>
            <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                placeholder="Enter email"
            />

            <label className="block text-sm font-medium text-gray-700 mt-3">Phone</label>
            <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                placeholder="Enter phone"
            />

            <div className="flex justify-end mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Save
                </button>
            </div>
        </div>
    );
}

export default Profile;

