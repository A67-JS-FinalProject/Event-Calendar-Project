const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Function to set custom claims
const setAdminClaim = async (uid) => {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Admin claim set for user ${uid}`);
  } catch (error) {
    console.error('Error setting admin claim:', error);
  }
};

module.exports = { admin, setAdminClaim };
