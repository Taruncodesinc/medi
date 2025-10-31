import mongoose from "mongoose";

let isDbConnected = false;

export async function connectMongo(uri?: string) {
  const mongoUri = uri || process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn("MONGODB_URI not set. Backend features depending on DB are disabled.");
    return;
  }
  if (isDbConnected) return;
  try {
    await mongoose.connect(mongoUri);
    isDbConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

export function dbReady() {
  return isDbConnected;
}
