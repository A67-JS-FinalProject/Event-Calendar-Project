import connect from "./connect.js";
import express from "express";
import cors from "cors";
import EventRoutes from "./routes/eventRoutes.js";
import admin from "firebase-admin";
import authRoutes from "./routes/authRoutes.js";
import fs from "fs/promises";
import path from "path";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // Import admin routes

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(EventRoutes);
app.use(userRoutes); // Ensure is present
app.use(adminRoutes); // admin routes

const serviceAccountPath = path.resolve("firebase-admin-sdk.json");
const serviceAccount = JSON.parse(
  await fs.readFile(serviceAccountPath, "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use("/auth", authRoutes);

// start the Express server
app.listen(PORT, () => {
  connect.connectToServer();
  console.log(`Server listening on port ${PORT}`);
});
