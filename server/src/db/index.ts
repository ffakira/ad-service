import mongoose from "mongoose";

export default class DatabaseManager {
  private static instance: DatabaseManager;

  public async connect(uri: string): Promise<void> {
    try {
      await mongoose.connect(uri);
    } catch (err) {
      if (err instanceof Error) {
        console.error("[DatabaseManager@connect]:", err.message);
        throw err;
      }
    }
  }

  public async disconnect(callback?: () => void): Promise<void> {
    try {
      await mongoose.disconnect();
      if (callback) {
        callback();
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("[DatabaseManager@disconnect]:", err.message);
        throw err;
      }
    }
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }
}
