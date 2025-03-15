const URL = `http://localhost:3000`;

export const createEvent = async (event, token) => {
  try {
    const response = await fetch(`${URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
export const getEvents = async () => {
  try {
    const response = await fetch(`${URL}/events`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getEventById = async (id) => {
  try {
    const response = await fetch(`${URL}/events/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const updateEvent = async (id, event) => {
  try {
    const response = await fetch(`${URL}/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const deleteEventsId = async (id) => {
  try {
    const response = await fetch(`${URL}/events/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

/**
 * @Atanas Zaykov
 */
export const getUserEvents = async (userId, token) => {
  try {
    const response = await fetch(`${URL}/events/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user events:", error);
    throw error;
  }
};

export const getUpcomingEvents = async (userId, token) => {
  try {
    const response = await fetch(`${URL}/events/upcoming/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    throw error;
  }
};

export const getEventsByDateRange = async (startDate, endDate, token) => {
  try {
    const response = await fetch(`${URL}/events?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Error fetching events:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const updateEventParticipants = async (eventId, participants, token) => {
  try {
    const response = await fetch(`${URL}/events/${eventId}/participants`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ participants }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating event participants:", error);
    throw error;
  }
};
