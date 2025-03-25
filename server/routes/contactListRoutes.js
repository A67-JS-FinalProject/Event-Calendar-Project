import express from "express";
import connectObject from "../connect.js";

let contactListRoutes = express.Router();

// Retrieve all contact lists for a user
contactListRoutes.route("/users/:email/contactLists").get(async (req, res) => {
  try {
    const db = connectObject.getDb();
    const user = await db.collection("users").findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ contactLists: user.contactLists || [] });
  } catch (error) {
    console.error("Error fetching contact lists:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add a contact list to the user
contactListRoutes.route("/users/:email/contactLists").put(async (req, res) => {
    try {
      const db = connectObject.getDb();
      const { contactListName, usersToAdd } = req.body;
  
      if (!contactListName) {
        return res.status(400).json({ message: "Contact list name is required" });
      }
  
      const usersArray = Array.isArray(usersToAdd) ? usersToAdd : [];

      const transformedUsers = usersArray.map(user => user.email);
  
      const result = await db.collection("users").updateOne(
        { email: req.params.email },
        {
          $push: {
            contactLists: {
              name: contactListName,
              users: transformedUsers
            },
          },
        }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "Contact list added successfully" });
    } catch (error) {
      console.error("Error adding contact list:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

// Remove a contact list from a user
contactListRoutes.route("/users/:email/contactLists/:listName").delete(async (req, res) => {
  try {
    const db = connectObject.getDb();
    const result = await db.collection("users").updateOne(
      { email: req.params.email },
      { $pull: { contactLists: { name: req.params.listName } } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Contact list not found" });
    }

    res.json({ message: "Contact list deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update users inside a contact list
contactListRoutes.route("/users/:email/contactLists/:listName").put(async (req, res) => {
  try {
    const db = connectObject.getDb();
    const { users } = req.body;

    if (!Array.isArray(users)) {
      return res.status(400).json({ message: "Users should be an array" });
    }

    const result = await db.collection("users").updateOne(
      { email: req.params.email, "contactLists.name": req.params.listName },
      { $addToSet: { "contactLists.$.users": { $each: users } } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User or contact list not found" });
    }

    res.json({ message: "Contact list updated successfully" });
  } catch (error) {
    console.error("Error updating contact list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get users inside a contact list
contactListRoutes.route("/users/:email/contactLists/:listName").get(async (req, res) => {
  try {
    const db = connectObject.getDb();
    const user = await db.collection("users").findOne(
      { email: req.params.email, "contactLists.name": req.params.listName },
      { projection: { "contactLists.$": 1 } }
    );

    if (!user) {
      return res.status(404).json({ message: "User or contact list not found" });
    }

    console.log("User Data:", user); // Add this log
    res.json({ users: user.contactLists[0].users });
  } catch (error) {
    console.error("Error fetching contact list participants:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default contactListRoutes;

// delete user from contact list
contactListRoutes.route("/users/:email/contactLists/:listName/:contactEmail").delete(async (req, res) => {
  try {
    const db = connectObject.getDb();
    const result = await db.collection("users").updateOne(
      { email: req.params.email, "contactLists.name": req.params.listName },
      { $pull: { "contactLists.$.users": req.params.contactEmail } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User or contact list not found" });
    }
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Contact not found in list" });
    }

    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
