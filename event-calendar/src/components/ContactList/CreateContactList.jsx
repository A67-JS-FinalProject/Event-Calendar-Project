import PropTypes from 'prop-types';
import { updateUserContactLists } from '../../services/contactListsService';
import { auth } from '../../config/firebaseConfig';
import { useEffect, useState } from 'react';
import { getContactLists } from '../../services/contactListsService';

function CreateContactList({ isOpen, onRequestClose }) {

    const [contactListName, setContactListName] = useState('');
    const [participants, setParticipants] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                console.log("Authenticated user found:", authUser.email);
            } else {
                console.log("No authenticated user found.");
            }
        });

        return () => unsubscribe();
    }, []);

    const handleInputChange = async (e) => {
        const newListName = e.target.value;
        try {
            setContactListName(newListName);
        } catch {
            alert("An error occurred while checking the contact list. Please try again.");
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        const authUser = auth.currentUser;

        if (authUser) {
            try {

                const lists = await getContactLists(authUser.email);
                const listNames = lists.map(list => list.name);

            if (listNames.includes(contactListName)) {
                alert("List name already exists. Please choose a different name.");
                return;
            }
            
                await updateUserContactLists(authUser.email, contactListName, participants);
                console.log("Contact List created successfully.");
                setContactListName('');
                setParticipants([]);
                setSearchQuery('');
                setSearchResults([]);
                onRequestClose();
            } catch (error) {
                console.error("Error creating contact list:", error);
            }
        } else {
            console.log("No authenticated user found.");
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-opacity-50"
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onRequestClose}
                    className="absolute top-2 right-2 text-red-500 text-xl"
                >
                    X
                </button>
                <h1 className="text-xl font-semibold mb-4">Create Contact List</h1>
                <form onSubmit={handleFormSubmit}>
                    <div className="form-group mb-4">
                        <label htmlFor="contactListName" className="block mb-1">
                            Contact List Name
                        </label>
                        <input
                            type="text"
                            className="form-control border p-2 rounded w-full"
                            id="contactListName"
                            value={contactListName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <label className="input">
                        <svg className="h-[1em] opacity-50" viewBox="0 0 24 24">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input
                            type="search"
                            placeholder="Search by name, user, email, phone"
                            value={searchQuery}
                            onChange={async (e) => {
                                const query = e.target.value.toLowerCase();
                                setSearchQuery(query);
                                if (query) {
                                    try {
                                        const response = await fetch('http://localhost:3000/users');
                                        const users = await response.json();
                                        const filteredUsers = users.filter(user =>
                                            user.email.toLowerCase().includes(query) ||
                                            (user.phoneNumber && user.phoneNumber.includes(query)) ||
                                            (user.username && user.username.toLowerCase().includes(query)) ||
                                            (user.firstName && user.firstName.toLowerCase().includes(query)) ||
                                            (user.lastName && user.lastName.toLowerCase().includes(query))
                                        );
                                        setSearchResults(filteredUsers);
                                    } catch (error) {
                                        console.error("Error fetching users:", error);
                                    }
                                } else {
                                    setSearchResults([]);
                                }
                            }}
                        />
                    </label>
                    <ul className="mt-2">
                        {searchResults.map((user, index) => {
                            // Determine what matched the search query
                            let matchedField = '';
                            if (user.phoneNumber && user.phoneNumber.includes(searchQuery)) {
                                matchedField = user.phoneNumber;
                            } else if (user.username && user.username.toLowerCase().includes(searchQuery)) {
                                matchedField = user.username;
                            } else if (user.firstName && user.firstName.toLowerCase().includes(searchQuery)) {
                                matchedField = user.firstName;
                            } else if (user.lastName && user.lastName.toLowerCase().includes(searchQuery)) {
                                matchedField = user.lastName;
                            }

                            return (
                                <li
                                    key={index}
                                    className="p-2 border-b cursor-pointer"
                                    onClick={() => {
                                        setParticipants((prevParticipants) => {
                                            if (!prevParticipants.some((participant) => participant.email === user.email)) {
                                                return [...prevParticipants, user];
                                            }
                                            return prevParticipants;
                                        });
                                        setSearchQuery('');
                                        setSearchResults([]);
                                    }}
                                >
                                    {user.email} {matchedField && `(${matchedField})`}
                                </li>
                            );
                        })}
                    </ul>

                    {/* Render selected participants below the search box */}
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold mb-2">Selected Participants:</h2>
                        <ul>
                            {participants.map((participant, index) => (
                                <li key={index} className="p-2 border rounded mb-2">
                                    {participant.email} {participant.phone && `(${participant.phone})`}
                                    <button
                                        className="ml-2 text-red-500"
                                        onClick={() => {
                                            setParticipants((prevParticipants) =>
                                                prevParticipants.filter((p) => p.email !== participant.email)
                                            );
                                        }}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                        Create Contact List
                    </button>
                </form>
            </div>
        </div>
    );
}

CreateContactList.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
};


export default CreateContactList;
