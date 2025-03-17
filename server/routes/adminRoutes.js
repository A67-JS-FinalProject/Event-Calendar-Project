import express from 'express';
import connect from '../connect.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { verifyAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();
const database = connect;

// Get dashboard statistics
router.get('/admin/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = database.getDb();
    
    // Get total events count
    const totalEvents = await db.collection('events').countDocuments();
    
    // Get active events count (events with end date after current date)
    const activeEvents = await db.collection('events').countDocuments({
      endDate: { $gte: new Date().toISOString() }
    });
    
    // Get total users count
    const totalUsers = await db.collection('users').countDocuments();

    res.json({
      events: {
        total: totalEvents,
        active: activeEvents
      },
      users: {
        total: totalUsers
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
});

export default router;
