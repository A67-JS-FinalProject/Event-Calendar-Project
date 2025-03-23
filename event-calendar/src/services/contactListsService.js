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