import mongoose from "mongoose";

const dbConnection = async (): Promise<void> => {
    const mongoUri = process.env.MONGODB_URI?.trim() || process.env.DB?.trim();

    if (!mongoUri) {
        throw new Error("MongoDB connection string is missing. Set MONGODB_URI.");
    }

    await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10_000,
    });

    console.log("DB connected successfully");
};

export default dbConnection;
