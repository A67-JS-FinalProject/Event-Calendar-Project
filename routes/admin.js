const express = require('express');
const router = express.Router();
const { admin } = require('../firebaseAdmin');
const Event = require('../models/Event');

// Middleware to verify admin
const verifyAdmin = async (req, res, next) => {
  const idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken.admin === true) {
      next();
    } else {
      res.status(403).send('Unauthorized');
    }
  } catch (error) {
    res.status(403).send('Unauthorized');
  }
};

// Search events
router.get('/search', verifyAdmin, async (req, res) => {
  try {
    const events = await Event.find(req.query);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Edit event
router.put('/edit/:id', verifyAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete event
router.delete('/delete/:id', verifyAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).send('Event deleted');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
