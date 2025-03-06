import connect from "./connect.js";
import express from "express";
import cors from "cors";
import EventRoutes from "./routes/eventRoutes.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(EventRoutes);

// start the Express server
app.listen(PORT, () => {
  connect.connectToServer();
  console.log(`Server listening on port ${PORT}`);
});
