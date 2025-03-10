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
    };
    let result = await db.collection("users").insertOne(newUser);
    console.log("Inserted user:", newUser); // Add logging
    res.json(result);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// Update User
userRoutes.route("/users/:id").put(async (req, res) => {
  try {
    let db = connectObject.getDb();
    let updatedUser = {
      $set: {
        email: req.body.email,
        username: req.body.username,
      },
    };
    let result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(req.params.id) }, updatedUser);
    console.log("Updated user:", updatedUser); // Add logging
    res.json(result);
  } catch (err) {
    res.status(400).json("Error: " + err);
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
