import { useState } from 'react';
import PropTypes from 'prop-types';

const EventInvitation = ({ invitation, currentUser, onResponseSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResponse = async (response) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetch(`http://localhost:3000/events/invitations/${invitation.id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser,
          response: response
        })
      });

      if (!result.ok) {
        throw new Error('Failed to update invitation');
      }

      onResponseSubmit(response);
    } catch (error) {
      console.error('Error updating invitation:', error);
      setError('Failed to respond to invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{invitation.eventTitle}</h3>
          <p className="text-gray-600">
            {new Date(invitation.eventDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-gray-500">From: {invitation.senderName}</p>
        </div>
        <div className="flex space-x-2">
          {invitation.status === 'pending' && (
            <>
              <button
                onClick={() => handleResponse('accepted')}
                disabled={isLoading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Accept'}
              </button>
              <button
                onClick={() => handleResponse('declined')}
                disabled={isLoading}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Decline'}
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      {invitation.status !== 'pending' && (
        <div className={`mt-2 text-sm ${
          invitation.status === 'accepted' ? 'text-green-600' : 'text-red-600'
        }`}>
          You have {invitation.status} this invitation
        </div>
      )}
    </div>
  );
};

EventInvitation.propTypes = {
  invitation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    eventTitle: PropTypes.string.isRequired,
    eventDate: PropTypes.string.isRequired,
    senderName: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  currentUser: PropTypes.string.isRequired,
  onResponseSubmit: PropTypes.func.isRequired,
};

export default EventInvitation;