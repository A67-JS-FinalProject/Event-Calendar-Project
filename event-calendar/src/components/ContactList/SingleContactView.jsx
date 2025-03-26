import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getContactListParticipants } from "../../services/contactListsService";
import { auth } from "../../config/firebaseConfig";
import { getUserByEmail } from "../../services/usersService";
import { deleteSingleContact } from "../../services/contactListsService";
import AddContact from "./AddContact";
import NavBarPrivate from "../NavBarPrivate/NavBarPrivate";
import { getContactLists } from "../../services/contactListsService";
import { useNavigate } from "react-router-dom";

function SingleContactView() {
    const { listName } = useParams();
    const [participants, setParticipants] = useState([]);
    const [authUser, setAuthUser] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [contactLists, setContactLists] = useState([]); // List of contact lists

    const navigate = useNavigate();

    // Fetch the user and contact lists
    useEffect(() => {
        const fetchUser = async () => {
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                const userData = await getUserByEmail(user.email, token);
                setAuthUser(userData);
            }
        };

        fetchUser();
    }, []);

    // Fetch contact lists and participants
    useEffect(() => {
        const fetchContactLists = async () => {
            if (authUser?.email) {
                try {
                    // Fetch all contact lists for the current user
                    const contactListData = await getContactLists(authUser.email);
                    setContactLists(contactListData);
                } catch (error) {
                    console.error("Error fetching contact lists:", error);
                }
            }
        };

        fetchContactLists();
    }, [authUser]);

    useEffect(() => {
        const fetchParticipants = async () => {
            if (authUser?.email) {
                try {
                    const data = await getContactListParticipants(authUser.email, listName);
                    console.log("Fetched Participants Data:", data);

                    if (data && data.users && Array.isArray(data.users) && data.users.length > 0) {
                        setParticipants(data.users);

                        const fetchDetails = async () => {
                            const details = {};
                            for (const email of data.users) {
                                const token = await auth.currentUser.getIdToken();
                                const userInfo = await getUserByEmail(email, token);
                                details[email] = {
                                    firstName: userInfo?.firstName || "No first name",
                                    lastName: userInfo?.lastName || "No last name",
                                    username: userInfo?.username || "No username",
                                    phoneNumber: userInfo?.phoneNumber || "No phone number",
                                    profilePictureURL: userInfo?.profilePictureURL ||
                                        "https://res.cloudinary.com/dglknhf3r/image/upload/v1741793969/default-profile-account-unknown-icon-black-silhouette-free-vector_nluuwb.jpg",
                                };
                            }
                            setUserDetails(details);
                            setLoading(false);
                        };

                        fetchDetails();
                    } else {
                        setParticipants([]);
                        setLoading(false);
                    }
                } catch (error) {
                    console.error("Error fetching contact list participants:", error);
                    setLoading(false);
                }
            }
        };

        fetchParticipants();
    }, [listName, authUser]);

    const handleAddParticipant = (newParticipant) => {
        if (participants.includes(newParticipant)) {
            console.warn("Participant already exists in the contact list.");
            return;
        }

        setParticipants((prevParticipants) => [...prevParticipants, newParticipant]);
    };

    const handleDelete = async (contactEmail) => {
        try {
            const token = await auth.currentUser.getIdToken();
            await deleteSingleContact(authUser.email, listName, contactEmail, token);
            setParticipants((prev) => prev.filter((item) => item !== contactEmail));
        } catch (error) {
            console.error("Error deleting contact:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        );
    }

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-1/5 bg-gray-800 text-white p-4 h-window">
                <Link to="/home/contact-lists" className="text-white">  <h2 className="text-xl font-bold mb-6">Contact Lists</h2></Link>
                <ul className="space-y-4">
                    {contactLists.length === 0 ? (
                        <li>No contact lists found</li>
                    ) : (
                        contactLists.map((list) => (
                            <li
                                key={list.name}
                                className="cursor-pointer hover:bg-gray-600 p-2 rounded"
                                onClick={() => navigate(`/home/contact-lists/${list.name}`)} // Navigate to the selected contact list
                            >
                                {list.name}
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-10">
                <NavBarPrivate />
                <h1 className="text-2xl font-bold mb-6 mt-6 text-center">Contacts in {listName}</h1>
                <div className="flex justify-end">
                    <button onClick={() => setModalOpen(true)} className="btn bg-gray-800 text-white btn-info mb-5 mr-7">Add Contacts</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mr-6 ml-6">
                    {participants.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500">No participants found</div>
                    ) : (
                        participants.map((email) => (
                            <div
                                key={email}
                                className="p-4 bg-gray-100 rounded-lg shadow-md text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                {/* Every participant data */}
                                <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
                                    <div className="avatar">
                                        <div className="w-16 h-16 rounded-full overflow-hidden">
                                            <img
                                                src={userDetails[email]?.profilePictureURL}
                                                alt="User Avatar"
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </div>

                                    <p className="font-semibold">{userDetails[email]?.firstName} {userDetails[email]?.lastName} (name)</p>
                                    <p className="text-gray-600">{userDetails[email]?.username} (username)</p>
                                    <p className="text-gray-600">{email} (email)</p>
                                    <p className="text-gray-600">{userDetails[email]?.phoneNumber} (phone)</p>

                                    <button
                                        className="btn bg-[#DA4735] btn-error rounded-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(email);
                                        }}
                                    >
                                        Delete Contact
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <AddContact
                    isOpen={isModalOpen}
                    onRequestClose={() => setModalOpen(false)}
                    listName={listName}
                    onAddParticipant={handleAddParticipant}
                />
            </div>
        </div>
    );
}

export default SingleContactView;
