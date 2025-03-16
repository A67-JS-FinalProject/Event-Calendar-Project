const URL = `http://localhost:3000`;
/* Users collection */
export const getUserByEmail = async (email, token) => {
  try {
    const response = await fetch(`${URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const allUsers = await response.json();
    const user = allUsers.find((user) => user.email === email);
    return user;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const createUser = async (
  email,
  username,
  firstName,
  lastName,
  phoneNumber
) => {
  try {
    const response = await fetch(`${URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        firstName,
        lastName,
        phoneNumber,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const updateUserProfile = async (email, userData) => {
  try {
    const response = await fetch(`${URL}/users/${email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
export const updateUserEvent = async (email, eventIds) => {
  try {
    const response = await fetch(`${URL}/users/${email}/events`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventIds }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user events:", error);
  }
};
