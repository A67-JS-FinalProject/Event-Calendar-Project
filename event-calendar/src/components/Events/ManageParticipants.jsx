import { useState } from 'react';
import PropTypes from 'prop-types';

const ManageParticipants = ({ participants, onUpdate, currentUserEmail }) => {
  const [newParticipant, setNewParticipant] = useState('');
  const [error, setError] = useState('');

  const handleAddParticipant = async () => {
    if (!newParticipant.trim()) {
      setError('Please enter an email address');
      return;
    }

    try {
      const updatedParticipants = [
        ...participants,
        {
          email: newParticipant.trim(),
          status: 'pending',
          role: 'invitee'
        }
      ];

      await onUpdate(updatedParticipants);
      setNewParticipant('');
      setError('');
    } catch {
      setError('Failed to add participant');
    }
  };

  const handleRemoveParticipant = async (emailToRemove) => {
    if (emailToRemove === currentUserEmail) {
      setError("Cannot remove event organizer");
      return;
    }

    try {
      const updatedParticipants = participants.filter(p => p.email !== emailToRemove);
      await onUpdate(updatedParticipants);
    } catch {
      setError('Failed to remove participant');
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Manage Participants</h3>
      
      <div className="flex gap-2 mb-4">
        <input
          type="email"
          value={newParticipant}
          onChange={(e) => setNewParticipant(e.target.value)}
          placeholder="Enter email to invite"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleAddParticipant}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Invite
        </button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="space-y-2">
        {participants.map((participant) => (
          <div key={participant.email} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <div>
              <span>{participant.email}</span>
              <span className="ml-2 text-sm text-gray-500">
                ({participant.role === 'organizer' ? 'Organizer' : 'Participant'})
              </span>
            </div>
            {participant.role !== 'organizer' && (
              <button
                onClick={() => handleRemoveParticipant(participant.email)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

ManageParticipants.propTypes = {
  eventId: PropTypes.string.isRequired,
  participants: PropTypes.arrayOf(PropTypes.shape({
    email: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired
  })).isRequired,
  onUpdate: PropTypes.func.isRequired,
  currentUserEmail: PropTypes.string.isRequired
};

export default ManageParticipants;