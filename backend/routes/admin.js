const express = require('express');
const router = express.Router();
const { getEvents, updateEvent, deleteEvent } = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/events', verifyToken, verifyAdmin, getEvents);
router.put('/events/:id', verifyToken, verifyAdmin, updateEvent);
router.delete('/events/:id', verifyToken, verifyAdmin, deleteEvent);

module.exports = router;
