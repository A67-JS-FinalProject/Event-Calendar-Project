import CreateContactList from "./CreateContactList";
import { useState, useEffect } from "react";
import { getContactLists, deleteContactList } from "../../services/contactListsService";
import { auth } from "../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";

function ContactList() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [contactLists, setContactLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchContactLists();
    }, [isModalOpen]);

    const fetchContactLists = async () => {
        setLoading(true);
        const authUser = auth.currentUser;
        if (authUser) {
            try {
                const lists = await getContactLists(authUser.email);
                setContactLists(lists);
            } catch (error) {
                console.error("Error fetching contact lists:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    const handleDelete = async (listName) => {
        const authUser = auth.currentUser;
        if (!authUser) return;

        try {
            await deleteContactList(authUser.email, listName);
            setContactLists(contactLists.filter(list => list.name !== listName));
        } catch (error) {
            console.error("Error deleting contact list:", error);
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
        <div>
            <h1 className="text-2xl font-bold mb-4 mt-6 text-center">Contact List</h1>

            <div className="grid grid-cols-2 ml-9 mr-9 gap-9">
                {contactLists.length === 0 ? (
                    <p className="text-gray-500 col-span-2 text-center">No contact lists found.</p>
                ) : (
                    contactLists.map((list, index) => (
                        <div
                            key={index}
                            className="p-4 border rounded-lg shadow bg-gray-100 flex justify-between items-center cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            onClick={() => navigate(`/home/contact-lists/${list.name}`)}
                        >
                            <span>{list.name}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(list.name);
                                }}
                                className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
            <button
                onClick={() => setModalOpen(true)}
                className="btn btn-primary mt-4"
            >
                Add Contact List
            </button>

            <CreateContactList
                isOpen={isModalOpen}
                onRequestClose={() => setModalOpen(false)}
                onListAdded={() => fetchContactLists()}
            />
        </div>
    );
}

export default ContactList;