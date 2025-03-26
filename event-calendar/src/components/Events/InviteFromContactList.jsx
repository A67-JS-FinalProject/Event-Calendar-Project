import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { getContactLists } from '../../services/contactListsService';
import { updateEventParticipants } from '../../services/eventService';
import { AppContext } from '../../store/app.context';
import { MdPeopleAlt } from 'react-icons/md';

function InviteFromContactList({ eventId, currentParticipants, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contactLists, setContactLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [participants, setParticipants] = useState('');
  const [selectedContactList, setSelectedContactList] = useState('');
  const { appState } = useContext(AppContext);

  const handleOpen = async () => {
    try {
      const lists = await getContactLists(appState.user);
      setContactLists(lists);
      setIsOpen(true);
    } catch (error) {
      console.error('Error fetching contact lists:', error);
    }
  };

  const handleInvite = async () => {
    if (!selectedList || !eventId) {
      console.error('Missing required data');
      return;
    }

    const selectedContacts = contactLists.find(list => list.name === selectedList);
    if (!selectedContacts) return;

    const currentEmails = currentParticipants.map(p => p.email);
    const newParticipants = selectedContacts.users
      .filter(email => !currentEmails.includes(email))
      .map(email => ({
        email,
        status: 'pending',
        role: 'invitee',
        permissions: {
          canInviteOthers: false,
          canViewGuestList: true
        }
      }));

    const updatedParticipants = [...currentParticipants, ...newParticipants];

    try {
      await updateEventParticipants(eventId, updatedParticipants, appState.token);
      onUpdate(updatedParticipants);
      setIsOpen(false);
      setSelectedList('');
      setParticipants('');
    } catch (error) {
      console.error('Error inviting participants:', error);
    }
  };

  const handleContactListSelect = (value) => {
    setSelectedContactList(value);
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className="btn btn-primary mb-4"
      >
        Invite from Contact List
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4">Select Contact List</h3>
            <select
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:border-gray-600"
              value={selectedList}
              onChange={(e) => setSelectedList(e.target.value)}
            >
              <option value="">Choose a list</option>
              {contactLists.map(list => (
                <option key={list.name} value={list.name}>
                  {list.name} ({list.users.length} contacts)
                </option>
              ))}
            </select>
            <div className="form-control mb-4 flex flex-row items-center space-x-6 px-6">
              <div>
                <MdPeopleAlt className="text-2xl" />
              </div>
              <div className="flex flex-col w-full gap-2">
                <input
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="Add participants"
                  className="input w-full border-0 border-b-2 border-gray-300 focus:outline-none 
                  focus:border-b-4 focus:border-blue-500 focus:bg-pink-300 
                  focus:text-blue-100 focus:opacity-100 transition-all"
                />
                
                <select
                  value={selectedContactList}
                  onChange={(e) => handleContactListSelect(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Select from contact lists</option>
                  {contactLists.map(list => (
                    <option key={list.name} value={list.name}>
                      {list.name} ({list.users?.length || 0} contacts)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="btn btn-primary"
                disabled={!selectedList}
              >
                Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
InviteFromContactList.propTypes = {
  eventId: PropTypes.string.isRequired,
  currentParticipants: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string.isRequired,
      status: PropTypes.string,
      role: PropTypes.string,
      permissions: PropTypes.shape({
        canInviteOthers: PropTypes.bool,
        canViewGuestList: PropTypes.bool
      })
    })
  ).isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default InviteFromContactList;
