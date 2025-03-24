import connect from "../connect.js";
import express from "express";
import { ObjectId } from "mongodb";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js"; // Import admin middleware

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
    eventCover,
    tags,
    reminders,
    createdBy,
    email,
  } = request.body;

  const newEvent = {
    title,
    startDate,
    endDate,
    location,
    description,
    participants: participants.map(p => ({
      ...p,
      status: p.email === request.body.organizer ? 'accepted' : 'pending',
      role: p.email === request.body.organizer ? 'organizer' : 'invitee'
    })),
    isPublic,
    isRecurring,
    eventCover,
    tags,
    reminders,
    createdBy,
    email,
  };

  try {
    const result = await db.collection("events").insertOne(newEvent);
    console.log("Insert result:", result);
    if (result.insertedId) {
      response.status(201).json({ _id: result.insertedId, ...newEvent });
    } else {
      throw new Error("Failed to create event");
    }
  } catch (error) {
    console.error("Error creating event:", error.message);
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
    eventCover,
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
      eventCover,
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

// Admin-specific routes

// Search events
EventRoutes.route("/admin/events/search").get(
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    const db = database.getDb();
    try {
      const events = await db.collection("events").find(req.query).toArray();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Edit event
EventRoutes.route("/admin/events/:id").put(
  verifyToken,
  verifyAdmin,
  async (req, res) => {
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
      eventCover,
      tags,
      reminders,
    } = req.body;

    const updatedEvent = {
      $set: {
        title,
        startDate,
        endDate,
        location,
        description,
        participants,
        isPublic,
        isRecurring,
        eventCover,
        tags,
        reminders,
      },
    };

    try {
      const result = await db
        .collection("events")
        .updateOne({ _id: new ObjectId(req.params.id) }, updatedEvent);
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Event updated successfully" });
      } else {
        res.status(404).json({ error: "Event not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete event
EventRoutes.route("/admin/events/:id").delete(
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    const db = database.getDb();
    try {
      const result = await db
        .collection("events")
        .deleteOne({ _id: new ObjectId(req.params.id) });
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Event deleted successfully" });
      } else {
        res.status(404).json({ error: "Event not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Add this route to handle invitation responses
EventRoutes.route("/events/invitations/:id/respond").post(async (request, response) => {
  const db = database.getDb();
  try {
    const { userId, response: inviteResponse } = request.body;
    const result = await db.collection("events").updateOne(
      { 
        _id: new ObjectId(request.params.id),
        "participants.email": userId // Ensure matching by email field
      },
      { 
        $set: { 
          "participants.$.status": inviteResponse,
          "participants.$.respondedAt": new Date()
        }
      }
    );

    if (result.modifiedCount === 0) {
      response.status(404).json({ error: "Invitation not found or already processed" });
    } else {
      response.status(200).json({ message: "Invitation response recorded successfully" });
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

export default EventRoutes;
