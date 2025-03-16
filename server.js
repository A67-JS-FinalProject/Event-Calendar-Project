const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin');
const { setAdminClaim } = require('./firebaseAdmin');

app.use('/admin', adminRoutes);

// Route to set admin claim
app.post('/setAdmin', async (req, res) => {
  const { uid } = req.body;
  try {
    await setAdminClaim(uid);
    res.status(200).send(`Admin claim set for user ${uid}`);
  } catch (error) {
    res.status(500).send('Error setting admin claim');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
