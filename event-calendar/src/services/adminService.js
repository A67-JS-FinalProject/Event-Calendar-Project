const URL = `http://localhost:3000`;

export const searchEvents = async (query, token) => {
  try {
    const response = await fetch(`${URL}/admin/events/search?${new URLSearchParams(query)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const editEvent = async (id, event, token) => {
  try {
    const response = await fetch(`${URL}/admin/events/${id}`, {
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
    console.error("Error updating event:", error);
  }
};

export const deleteEvent = async (id, token) => {
  try {
    const response = await fetch(`${URL}/admin/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};
