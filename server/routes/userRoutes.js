import express from "express";
import connectObject from "../connect.js";
import { ObjectId } from "mongodb";
let userRoutes = express.Router();

// Retrieve All Users
userRoutes.route("/users").get(async (req, res) => {
  try {
    let db = connectObject.getDb();
    let users = await db.collection("users").find({}).toArray();
    if (users.length === 0) {
      throw new Error("No Users found");
    }
    console.log("Retrieved users:", users); // Add logging
    res.json(users);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// Retrieve User by ID
userRoutes.route("/users/:id").get(async (req, res) => {
  try {
    let db = connectObject.getDb();
    let user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (Object.keys(user).length === 0) {
      throw new Error("User not found");
    }
    console.log("Retrieved user:", user); // Add logging
    res.json(user);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// Add User
userRoutes.route("/users").post(async (req, res) => {
  try {
    let db = connectObject.getDb();
    let newUser = {
      email: req.body.email,
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      createdOn: new Date(),
      profilePictureURL:
        "https://res.cloudinary.com/dglknhf3r/image/upload/v1741793969/default-profile-account-unknown-icon-black-silhouette-free-vector_nluuwb.jpg",
      isAdmin: false,
      contactLists: [],
      isBlocked: false,
    };
    let result = await db.collection("users").insertOne(newUser);
    console.log("Inserted user:", newUser); // Add logging
    res.json(result);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// Update User
userRoutes.route("/users/:email").put(async (req, res) => {
  try {
    let db = connectObject.getDb();
    let updatedUser = {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        profilePictureURL: req.body.profilePictureURL,
      },
    };

    let result = await db
      .collection("users")
      .updateOne({ email: req.params.email }, updatedUser);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated user:", updatedUser);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete User
userRoutes.route("/users/:id").delete(async (req, res) => {
  try {
    let db = connectObject.getDb();
    let result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    console.log("Deleted user with ID:", req.params.id); // Add logging
    res.json(result);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});
// upload the event id  to user
userRoutes.route("/users/:email/events").put(async (req, res) => {
  try {
    let db = connectObject.getDb();
    let user = await db
      .collection("users")
      .findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let updatedEvents = user.events || [];
    req.body.eventIds.forEach((id) => {
      const objectId = new ObjectId(id);
      if (!updatedEvents.some((eventId) => eventId.equals(objectId))) {
        updatedEvents.push(objectId);
      }
    });

    let updatedUser = {
      $set: {
        events: updatedEvents,
      },
    };

    let result = await db
      .collection("users")
      .updateOne({ email: req.params.email }, updatedUser);

    console.log("Updated user events:", updatedUser);
    res.json({ message: "User events updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

userRoutes.put("/users/:email/block", async (req, res) => {
  const { email } = req.params;
  try {
    let db = connectObject.getDb();
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = await db
      .collection("users")
      .updateOne({ email }, { $set: { isBlocked: !user.isBlocked } });
    console.log("Updated user block status:", updatedUser);
    res.json({ message: "User block status updated successfully" });
  } catch (error) {
    console.error("Error updating user block status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default userRoutes;
