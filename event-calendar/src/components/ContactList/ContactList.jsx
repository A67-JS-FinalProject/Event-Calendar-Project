import CreateContactList from "./CreateContactList";
import { useState, useEffect } from "react";
import { getContactLists, deleteContactList } from "../../services/contactListsService";
import { auth } from "../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import NavBarPrivate from "../NavBarPrivate/NavBarPrivate";
import { IoMdRemoveCircle } from "react-icons/io";

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
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#DA4735]"></div>
            </div>
        );
    }

    return (
        <>
            <NavBarPrivate />
            <div className="min-h-screen bg-white">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col items-center mb-10">
                        <h1 className="text-4xl font-bold mb-4 text-[#DA4735]">Contact Lists</h1>
                        <div className="w-20 h-1 bg-[#DA4735] mb-6"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {contactLists.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center py-12">
                                <svg className="h-20 w-20 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   
                                </svg>
                                <p className="text-gray-500 text-lg mb-6">No contact lists found</p>
                            </div>
                        ) : (
                            contactLists.map((list, index) => (
                                <div
                                    key={index}
                                    className="group relative p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                                    onClick={() => navigate(`/home/contact-lists/${list.name}`)}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-[#DA4735] group-hover:h-2 transition-all duration-300"></div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{list.name}</h3>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(list.name);
                                            }}
                                            className="text-gray-400 hover:text-[#DA4735] transition-colors duration-200 p-1"
                                        >
                                                <IoMdRemoveCircle className="text-2xl" />
                                        </button>
                                    </div>
                                    <div className="flex items-center mt-4 text-gray-500">
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => setModalOpen(true)}
                            className="bg-[#DA4735] hover:bg-[#c03d2d] text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
                        >
                            <svg  className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                               
                            </svg>
                            Add Contact List
                        </button>
                    </div>
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