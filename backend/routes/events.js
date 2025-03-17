router.get('/events', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const events = await Event.find().skip(skip).limit(limit);
        const totalEvents = await Event.countDocuments();
        res.json({
            events,
            totalPages: Math.ceil(totalEvents / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
