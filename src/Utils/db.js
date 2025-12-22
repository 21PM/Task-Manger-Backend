import mongoose from "mongoose";

const connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    console.log("process.env.MONGO_URI", process.env.MONGO_URI);

    process.exit(1);
  }
};

export default connectMongoDb;
