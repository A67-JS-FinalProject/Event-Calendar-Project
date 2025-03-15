import { useState, useEffect } from "react";
import { getUserByEmail, updateUserProfile } from "../../services/usersService";
import { auth } from "../../config/firebaseConfig";
import axios from "axios";

function Details() {
    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profilePictureURL, setProfilePictureURL] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                console.log("Authenticated user found:", authUser);
                try {
                    console.log("Fetching user data...");
                    const token = await authUser.getIdToken();
                    const userData = await getUserByEmail(authUser.email, token);

                    if (userData) {
                        console.log("User data fetched:", userData);
                        setUser(userData);
                        setFirstName(userData.firstName || "");
                        setLastName(userData.lastName || "");
                        setPhoneNumber(userData.phoneNumber || "");
                        setProfilePictureURL(userData.profilePictureURL || "");
                    } else {
                        console.log("User data not found");
                        setError("User data not found");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setError(error.message);
                }
            } else {
                console.log("No authenticated user found.");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setError("File size must be under 2MB");
            return;
        }

        setUploading(true);
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "profile_pictures");
        formData.append("cloud_name", "dglknhf3r");

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dglknhf3r/image/upload",
                formData
            );

            const imageUrl = response.data.secure_url;
            setProfilePictureURL(imageUrl);
            setSuccess("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            setError("Image upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!user) return;

        if (firstName.length < 4 || firstName.length > 32) {
            setError("First name must be between 4 and 32 characters.");
            return;
        }
        if (lastName.length < 4 || lastName.length > 32) {
            setError("Last name must be between 4 and 32 characters.");
            return;
        }
        if (phoneNumber.length < 10 || phoneNumber.length > 10) {
            setError("Phone number must be 10 characters.");
            return;
        }

        try {
            await updateUserProfile(user.email, {
                firstName,
                lastName,
                phoneNumber,
                profilePictureURL,
            });
            setSuccess("Profile updated successfully!");
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        );

    return (
        <div className="max-w-md mx-auto mt-8 p-6 border border-gray-300 rounded-lg shadow-lg bg-white mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Profile Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center border-b border-gray-300 pb-4 mb-4">
                    <div className="w-30 h-30 rounded-full overflow-hidden border-1 border-black shadow-md mb-4">
                        <img
                            src={profilePictureURL}
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <fieldset className="fieldset mb-2">
                        <legend className="fieldset-legend">Change Photo</legend>
                        <input type="file" className="file-input" onChange={handleFileChange}/>
                        <label className="fieldset-label">Max size 2MB</label>
                    </fieldset>
                    {uploading && <p className="text-blue-500">Uploading...</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Username (Cannot be changed)</label>
                    <input className="input input-bordered w-full" value={user?.username || ""} disabled />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Email (Cannot be changed)</label>
                    <input className="input input-bordered w-full" value={user?.email || ""} disabled />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">First Name</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Last Name</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Phone Number</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your phone number"
                    />
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <button type="submit" className="btn btn-primary w-full">
                    Update Profile
                </button>
            </form>
        </div>
    );
}

export default Details;

