import mongoose from "mongoose";
import { env } from "./env.js";

const MONGO_OPTIONS: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

export async function connectDB(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error :", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    await mongoose.connect(env.MONGO_URI, MONGO_OPTIONS);
  } catch (error) {
    console.error("MongoDB Initial connection failed :", error);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
}
