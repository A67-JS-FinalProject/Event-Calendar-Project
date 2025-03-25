const URL = `http://localhost:3000`;

// Update a contact list
export const updateUserContactLists = async (email, contactListName, usersToAdd = []) => {
  try {
    const response = await fetch(`${URL}/users/${email}/contactLists`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contactListName, usersToAdd }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating contact list:", error);
    throw error;
  }
};

// Retrieve contact lists for user
export const getContactLists = async (email) => {
  try {
    const response = await fetch(`${URL}/users/${email}/contactLists`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch contact lists");
    }
    const data = await response.json();
    return data.contactLists;
  } catch (error) {
    console.error("Error fetching contact lists:", error);
    throw error;
  }
}

// Delete a contact list
export const deleteContactList = async (email, listName) => {
  try {
    const response = await fetch(`${URL}/users/${email}/contactLists/${listName}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to delete contact list");

    return { message: "Contact list deleted successfully" };
  } catch (error) {
    console.error("Error deleting contact list:", error);
    throw error;
  }
};

// Retrieve participants of a contact list
export const getContactListParticipants = async (email, listName) => {

  try {
    const response = await fetch(`${URL}/users/${email}/contactLists/${listName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching contact list participants:", error);
    throw error;
  }
};

// Delete a contact from a contact list
export const deleteSingleContact = async (email, listName, contactEmail) => {
  try {
    const response = await fetch(`${URL}/users/${email}/contactLists/${listName}/${contactEmail}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to delete contact");

    return { message: "Contact deleted successfully" };
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
}

// Put contacts in a contact list
export const putContactsInContactList = async (email, listName, newUsers = []) => {
  try {
    // Fetch existing users first
    const existingData = await getContactListParticipants(email, listName);
    const existingUsers = existingData.users || [];

    // Merge existing users with new users (avoid duplicates)
    const usersToAdd = newUsers.filter(user => !existingUsers.includes(user));

    if (usersToAdd.length === 0) {
      return { message: "No new users to add." };
    }

    // Send only new users to backend
    const response = await fetch(`${URL}/users/${email}/contactLists/${listName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users: usersToAdd }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating contact list:", error);
    throw error;
  }
};
