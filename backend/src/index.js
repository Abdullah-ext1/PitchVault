/**
 * Application Entry Point
 * Loads environment variables, connects to MongoDB, and starts the Express server
 */

import "dotenv/config";

import connectDB from "./db/db-connection.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 4000;

// Connect to database then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Rejection:", error);
  process.exit(1);
});
