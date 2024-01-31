import { Model } from "mongoose";
import UserModel, { User, UserDocument } from "../models/user.model";

/** @dev CRUD operations for accessing to Mongo */
export default class UserRepository {
  private userModel: Model<UserDocument>;

  constructor() {
    this.userModel = UserModel as Model<UserDocument>;
  }

  async getUserById(userId: string): Promise<Partial<User> | null> {
    try {
      const user = await this.userModel.findById(userId).lean();
      return user ? (user as Partial<User>) : null;
    } catch (err) {
      console.error("[UserRepository@getUserById]:", (err as Error).message);
      throw err;
    }
  }

  async getUserByUsername(username: string): Promise<Partial<User> | null> {
    try {
      const user = await this.userModel.findOne({ username }).lean();
      return user ? (user as Partial<User>) : null;
    } catch (err) {
      console.error(
        "[UserRepository@getUserByUsername]:",
        (err as Error).message
      );
      throw err;
    }
  }

  async getRowCountUsers(): Promise<number> {
    try {
      const userCount = await this.userModel.countDocuments({});
      return userCount;
    } catch (err) {
      console.error(
        "[UserRepository@getRowCountUsers]:",
        (err as Error).message
      );
      throw err;
    }
  }

  async createUser(user: Partial<User>): Promise<Partial<User>> {
    try {
      const newUser = await this.userModel.create(user);
      return newUser.toObject();
    } catch (err) {
      console.error("[UserRepository@insertUser]:", (err as Error).message);
      throw err;
    }
  }
}
