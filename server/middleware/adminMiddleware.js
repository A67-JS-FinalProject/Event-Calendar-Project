import admin from "firebase-admin";

const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (decodedToken.admin === true) {
      next();
    } else {
      res.status(403).json({ message: "Unauthorized: Admin access required" });
    }
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export { verifyAdmin };
