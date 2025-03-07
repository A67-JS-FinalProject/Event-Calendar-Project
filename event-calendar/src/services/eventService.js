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
