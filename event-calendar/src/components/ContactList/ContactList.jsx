import CreateContactList from "./CreateContactList";
import { useState, useEffect } from "react";
import { getContactLists, deleteContactList } from "../../services/contactListsService";
import { auth } from "../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import NavBarPrivate from "../NavBarPrivate/NavBarPrivate";

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
        <>
            <NavBarPrivate />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Contact List</h1>
                <div className="grid md:grid-cols-2 gap-6">
                    {contactLists.length === 0 ? (
                        <p className="text-gray-500 col-span-full text-center">No contact lists found.</p>
                    ) : (
                        contactLists.map((list, index) => (
                            <div
                                key={index}
                                className="p-5 border rounded-lg shadow bg-white flex justify-between items-center cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                                onClick={() => navigate(`/home/contact-lists/${list.name}`)}
                            >
                                <span className="text-lg font-medium text-gray-700">{list.name}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(list.name);
                                    }}
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200"
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg"
                    >
                        + Add Contact List
                    </button>
                </div>
                <CreateContactList
                    isOpen={isModalOpen}
                    onRequestClose={() => setModalOpen(false)}
                    onListAdded={() => fetchContactLists()}
                />
            </div>
        </>
    );
}

export default ContactList;