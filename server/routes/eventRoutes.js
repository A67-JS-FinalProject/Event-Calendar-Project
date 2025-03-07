import connect from "../connect.js";
import express from "express";
import { ObjectId } from "mongodb";

const database = connect;
const EventRoutes = express.Router();

// 1. Create One
EventRoutes.route("/events").post(async (request, response) => {
  const db = database.getDb();
  const {
    title,
    startDate,
    endDate,
    location,
    description,
    participants,
    isPublic,
    isRecurring,
    coverPhoto,
    tags,
    reminders,
  } = request.body;

  const newEvent = {
    title,
    startDate,
    endDate,
    location,
    description,
    participants,
    isPublic,
    isRecurring,
    coverPhoto,
    tags,
    reminders,
  };

  try {
    const result = await db.collection("events").insertOne(newEvent);
    response.status(201).json(result.ops[0]);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// 2. Retrieve All
EventRoutes.route("/events").get(async (request, response) => {
  const db = database.getDb();
  try {
    const data = await db.collection("events").find({}).toArray();
    if (data.length > 0) {
      response.json(data);
    } else {
      response.status(404).json({ error: "Data not found" });
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// 3. Retrieve One
EventRoutes.route("/events/:id").get(async (request, response) => {
  const db = database.getDb();
  try {
    const data = await db
      .collection("events")
      .findOne({ _id: new ObjectId(request.params.id) });
    if (data) {
      response.json(data);
    } else {
      response.status(404).json({ error: "Data not found" });
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// 4. Update One
EventRoutes.route("/events/:id").post(async (request, response) => {
  const db = database.getDb();
  const {
    title,
    startDate,
    endDate,
    location,
    description,
    participants,
    isPublic,
    isRecurring,
    coverPhoto,
    tags,
    reminders,
  } = request.body;

  const newEvent = {
    $set: {
      title,
      startDate,
      endDate,
      location,
      description,
      participants,
      isPublic,
      isRecurring,
      coverPhoto,
      tags,
      reminders,
    },
  };

  try {
    const result = await db
      .collection("events")
      .updateOne({ _id: new ObjectId(request.params.id) }, newEvent);
    if (result.modifiedCount > 0) {
      response.status(200).json({ message: "Event updated successfully" });
    } else {
      response.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// 5. Delete One
EventRoutes.route("/events/:id").delete(async (request, response) => {
  const db = database.getDb();
  try {
    const result = await db
      .collection("events")
      .deleteOne({ _id: new ObjectId(request.params.id) });
    if (result.deletedCount > 0) {
      response.status(200).json({ message: "Event deleted successfully" });
    } else {
      response.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

export default EventRoutes;
