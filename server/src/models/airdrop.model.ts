import { Schema, model, Types } from "mongoose";
import { z } from "zod";

/** @dev Model for airdrop repository */
interface Airdrop {
  _id?: Types.ObjectId;
  nft?: Types.ObjectId;
  recipientAddress: string;
  redeemCode: string;
  isClaimed: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

/** @dev Validating schema for req.body */
const AirdropSchemaZod = z.object({
  contractAddress: z.string(),
  recipientAddress: z.string(),
  isClaimed: z.optional(z.boolean()),
});

export interface AirdropDocument extends Airdrop, Document {}

/** @dev Mongo schema defition */
const AirdropSchema = new Schema<AirdropDocument>({
  nft: {
    type: Schema.Types.ObjectId,
    ref: "Nft",
  },
  recipientAddress: {
    type: String,
    default: "0x0000000000000000000000000000000000000000",
  },
  redeemCode: {
    type: String,
    required: true,
  },
  isClaimed: {
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

AirdropSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const AirdropModel = model<AirdropDocument>("Airdrop", AirdropSchema);

export default AirdropModel;
export { Airdrop, AirdropSchemaZod };
