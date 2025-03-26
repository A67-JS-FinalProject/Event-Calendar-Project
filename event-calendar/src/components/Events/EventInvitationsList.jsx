import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../store/app.context';
import EventInvitation from './EventInvitation';

function EventInvitationsList() {
  const [invitations, setInvitations] = useState([]);
  const { appState } = useContext(AppContext);
  
  const fetchInvitations = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events`, {
        headers: {
          'Authorization': `Bearer ${appState.token}`
        }
      });
      const data = await response.json();
      
      const userInvitations = data.filter(event => 
        event.participants.some(p => 
          p.email === appState.user && 
          p.role === 'invitee' && 
          p.status === 'pending'
        )
      ).map(event => ({
        id: event._id,
        eventTitle: event.title,
        eventDate: event.startDate,
        senderName: `${event.createdBy.firstName} ${event.createdBy.lastName}`,
        status: event.participants.find(p => p.email === appState.user)?.status || 'pending'
      }));

      setInvitations(userInvitations);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  useEffect(() => {
    if (appState.user) {
      fetchInvitations();
    }
  }, [appState.user, appState.token]);

  const handleResponseSubmit = async (invitationId, response) => {
    try {
      await fetch(`http://localhost:3000/events/invitations/${invitationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${appState.token}`
        },
        body: JSON.stringify({ response })
      });

      fetchInvitations();
    } catch (error) {
      console.error('Error updating invitation:', error);
    }
  };

  if (!appState.user) {
    return null;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Event Invitations</h2>
      {invitations.length === 0 ? (
        <p className="text-gray-500">No pending invitations</p>
      ) : (
        <div className="space-y-4">
          {invitations.map(invitation => (
            <EventInvitation
              key={invitation.id}
              invitation={invitation}
              currentUser={appState.user}
              onResponseSubmit={(response) => handleResponseSubmit(invitation.id, response)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default EventInvitationsList;