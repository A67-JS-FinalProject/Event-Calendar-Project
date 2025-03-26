import axios from "axios";

const URL = `http://localhost:3000`;
export const getAllEvents = async (token) => {
  try {
    console.log("Fetching events from:", `${URL}/events`);
    const response = await fetch(`${URL}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error fetching events:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching events:", error.message);
    return [];
  }
};
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

export const deleteRecurringEvents = async (seriesId, token) => {
  try {
    const response = await axios.delete(`${URL}/events/recurring/${seriesId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting recurring events:", error);
    throw error;
  }
};

export const editEvent = async (id, event, token) => {
  try {
    const response = await fetch(`${URL}/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error editing event:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId, token) => {
  try {
    const response = await axios.delete(`${URL}/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const getEventsInRange = async (eventId, startDate, endDate, token) => {
  const response = await axios.get(
    `${URL}/${eventId}/events-range?startDate=${startDate}&endDate=${endDate}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

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
    const response = await fetch(
      `${URL}/events?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error fetching events:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const updateEventParticipants = async (eventId, participants, token) => {
  try {
    if (!eventId || typeof eventId !== 'string') {
      throw new Error('Invalid event ID');
    }

    console.log('Making request to:', `${URL}/events/${eventId}`);
    console.log('Payload:', { participants });

    const response = await fetch(`${URL}/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ participants })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(`Server responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating event participants:", error);
    throw error;
  }
};
