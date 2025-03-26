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
  const [selectedUsers, setSelectedUsers] = useState([]);
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

  const handleListChange = (e) => {
    const listName = e.target.value;
    setSelectedList(listName);
    setSelectedUsers([]);
  };

  const handleUserSelect = (email) => {
    setSelectedUsers(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const handleInvite = async () => {
    if (!selectedList || !eventId || selectedUsers.length === 0) {
      console.error('Missing required data');
      return;
    }

    try {
      // Format participants data according to API requirements
      const currentEmails = currentParticipants.map(p => p.email);
      const newParticipants = selectedUsers
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

      if (newParticipants.length === 0) {
        console.log('No new participants to add');
        return;
      }

      const updatedParticipants = [...currentParticipants, ...newParticipants];

      // Add more detailed logging
      console.log('Current participants:', currentParticipants);
      console.log('New participants:', newParticipants);
      console.log('Updated participants:', updatedParticipants);

      console.log('Sending request with:', {
        eventId,
        token: appState.token ? 'present' : 'missing',
        participantsCount: updatedParticipants.length
      });

      const result = await updateEventParticipants(eventId, updatedParticipants, appState.token);
      
      if (result) {
        console.log('Successfully updated participants:', result);
        onUpdate(result.participants || updatedParticipants);
        setIsOpen(false);
        setSelectedList('');
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error('Error inviting participants:', error);
      const errorMessage = error.message || 'Failed to invite participants. Please try again.';
      alert(errorMessage);
    }
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
              onChange={handleListChange}
            >
              <option value="">Choose a list</option>
              {contactLists.map(list => (
                <option key={list.name} value={list.name}>
                  {list.name} ({list.users.length} contacts)
                </option>
              ))}
            </select>

            {selectedList && (
              <div className="mb-4 max-h-60 overflow-y-auto">
                {contactLists
                  .find(list => list.name === selectedList)
                  ?.users.map(email => (
                    <div key={email} className="flex items-center gap-2 p-2">
                      <input
                        type="checkbox"
                        id={email}
                        checked={selectedUsers.includes(email)}
                        onChange={() => handleUserSelect(email)}
                        className="checkbox"
                      />
                      <label htmlFor={email}>{email}</label>
                    </div>
                  ))}
              </div>
            )}

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
                disabled={!selectedList || selectedUsers.length === 0}
              >
                Invite ({selectedUsers.length})
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
