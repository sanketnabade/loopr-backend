import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Financial Dashboard API is running",
    timestamp: new Date().toISOString(),
  });
});

// Auth test route
app.post("/api/auth/test", (req, res) => {
  res.json({
    message: "Auth endpoint working",
    body: req.body
  });
});

app.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Test auth: http://localhost:${PORT}/api/auth/test`);
});

export default app;
