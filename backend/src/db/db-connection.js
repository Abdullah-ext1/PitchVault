/**
 * MongoDB Connection Setup
 * Establishes connection to MongoDB database
 */

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(
      `✅ MongoDB Connected! Host: ${connectionInstance.connection.host}`
    );
    console.log(`📦 Database: ${connectionInstance.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
