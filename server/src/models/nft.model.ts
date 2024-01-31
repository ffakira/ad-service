import { Schema, model, Types } from "mongoose";

interface Nft {
  _id?: Types.ObjectId;
  address: string;
  chain: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface NftDocument extends Nft, Document {}

const NftSchema = new Schema<NftDocument>({
  address: {
    type: String,
    required: true,
  },
  chain: {
    type: String,
    required: true,
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

NftSchema.pre("save", async function (next) {
  this.updatedAt = new Date();
  this.address = this.address.toLowerCase().trim();
  this.chain = this.chain.toLowerCase().trim();
});

const NftModel = model<NftDocument>("Nft", NftSchema);

export default NftModel;
export { Nft, NftSchema };
