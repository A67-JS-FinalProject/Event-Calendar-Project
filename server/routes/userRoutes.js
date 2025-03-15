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
      profilePictureURL: "https://res.cloudinary.com/dglknhf3r/image/upload/v1741793969/default-profile-account-unknown-icon-black-silhouette-free-vector_nluuwb.jpg"
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

    let result = await db.collection("users").updateOne(
      { email: req.params.email },
      updatedUser
    );

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

export default userRoutes;
