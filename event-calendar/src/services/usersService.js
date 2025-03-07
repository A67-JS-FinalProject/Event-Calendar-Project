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

    const allUsers = await response.json(); // Parse the response to JSON
    const user = allUsers.find((user) => user.email === email);
    return user;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
