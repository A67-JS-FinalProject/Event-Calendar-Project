const BASE_URL = 'http://localhost:3000/admin';

export const searchEvents = async (query, token) => {
  try {
    const response = await fetch(`${BASE_URL}/events/search?${new URLSearchParams(query)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to search events');
    return await response.json();
  } catch (error) {
    console.error('Error searching events:', error);
    throw error;
  }
};

export const editEvent = async (id, event, token) => {
  try {
    const response = await fetch(`${BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(event)
    });
    if (!response.ok) throw new Error('Failed to edit event');
    return await response.json();
  } catch (error) {
    console.error('Error editing event:', error);
    throw error;
  }
};

export const deleteEvent = async (id, token) => {
  try {
    const response = await fetch(`${BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete event');
    return await response.json();
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};