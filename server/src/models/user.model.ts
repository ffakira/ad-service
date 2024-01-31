import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { z } from "zod";

/** @dev Model for user repository */
interface User {
  username: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

/** @dev Validating schema for req.body */
const UserSchemaZod = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(8),
});

export interface UserDocument extends User, Document {}

/** @dev Mongo schema definition */
const UserSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

UserSchema.pre("save", async function(next) {
  this.updatedAt = new Date();
  this.username = this.username.toLowerCase().trim();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    console.error("UserSchema@pre_save:", (err as Error).message);
    next(err as Error);
  }
});

const UserModel = model<UserDocument>("User", UserSchema);

export default UserModel;
export { User, UserSchemaZod };
