import CreateContactList from "./CreateContactList";
import { useState, useEffect } from "react";
import { getContactLists, deleteContactList } from "../../services/contactListsService";
import { auth } from "../../config/firebaseConfig";

function ContactList() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [contactLists, setContactLists] = useState([]);

    useEffect(() => {
        fetchContactLists();
    }, [isModalOpen]); 

    const fetchContactLists = async () => {
        const authUser = auth.currentUser;
        if (authUser) {
            try {
                const lists = await getContactLists(authUser.email);
                setContactLists(lists);
            } catch (error) {
                console.error("Error fetching contact lists:", error);
            }
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

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Contact List</h1>

            <div className="grid grid-cols-3 gap-4">
                {contactLists.map((list, index) => (
                    <div key={index} className="p-4 border rounded shadow bg-gray-100 flex justify-between items-center">
                        <span>{list.name}</span>
                        <button
                            onClick={() => handleDelete(list.name)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                            Delete
                        </button>
                    </div>
                ))}
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