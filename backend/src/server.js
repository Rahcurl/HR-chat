import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

const app = express();

// FIX 1: Use process.env.PORT for production, fallback to 5001 for local dev
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

// FIX 2: Dynamic CORS origin
app.use(
  cors({
    // In production, we allow the app to talk to itself. In dev, we allow localhost:5173
    origin: process.env.NODE_ENV === "production" ? false : "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  
  const frontendPath = path.join(__dirname, "frontend", "dist");
  
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// FIX 3: Ensure DB connects before or during server start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});