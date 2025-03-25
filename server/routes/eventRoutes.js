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
    recurrenceType,
    recurrenceEndDate,
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
    participants: participants.map((p) => ({
      ...p,
      status: p.email === request.body.organizer ? "accepted" : "pending",
      role: p.email === request.body.organizer ? "organizer" : "invitee",
    })),
    isPublic,
    isRecurring,
    recurrenceType,
    recurrenceEndDate,
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
EventRoutes.route("/events/:id").put(async (req, res) => {
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
    recurrenceType,
    recurrenceEndDate,
    eventCover,
    tags,
    reminders,
    createdBy,
    email,
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
      recurrenceType,
      recurrenceEndDate,
      eventCover,
      tags,
      reminders,
      createdBy,
      email,
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
});

// Delete event
EventRoutes.route("/events/:id").delete(async (req, res) => {
  const db = database.getDb();
  try {
    // Find the event to check if it's recurring
    const event = await db
      .collection("events")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.isRecurring) {
      // Delete all recurring events with the same recurrenceType and recurrenceEndDate
      const result = await db.collection("events").deleteMany({
        isRecurring: true,
        recurrenceType: event.recurrenceType,
        recurrenceEndDate: event.recurrenceEndDate,
      });

      if (result.deletedCount > 0) {
        return res
          .status(200)
          .json({
            message: `${result.deletedCount} recurring events deleted successfully`,
          });
      } else {
        return res
          .status(404)
          .json({ error: "No recurring events found to delete" });
      }
    } else {
      // Delete a single event if it's not recurring
      const result = await db
        .collection("events")
        .deleteOne({ _id: new ObjectId(req.params.id) });

      if (result.deletedCount > 0) {
        return res.status(200).json({ message: "Event deleted successfully" });
      } else {
        return res.status(404).json({ error: "Event not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      recurrenceType,
      recurrenceEndDate,
      eventCover,
      tags,
      reminders,
      createdBy,
      email,
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
        recurrenceType,
        recurrenceEndDate,
        eventCover,
        tags,
        reminders,
        createdBy,
        email,
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
EventRoutes.route("/events/invitations/:id/respond").post(
  async (request, response) => {
    const db = database.getDb();
    try {
      const { userId, response: inviteResponse } = request.body;
      const result = await db.collection("events").updateOne(
        {
          _id: new ObjectId(request.params.id),
          "participants.email": userId, // Ensure matching by email field
        },
        {
          $set: {
            "participants.$.status": inviteResponse,
            "participants.$.respondedAt": new Date(),
          },
        }
      );

      if (result.modifiedCount === 0) {
        response
          .status(404)
          .json({ error: "Invitation not found or already processed" });
      } else {
        response
          .status(200)
          .json({ message: "Invitation response recorded successfully" });
      }
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }
);

export default EventRoutes;
