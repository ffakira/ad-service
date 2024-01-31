import { Model } from "mongoose";
import NftModel, { Nft, NftDocument } from "../models/nft.model";

export default class NftRepository {
  private nftModel: Model<NftDocument>;

  constructor() {
    this.nftModel = NftModel as Model<NftDocument>;
  }

  async getNftByAddress(nftAddress: string): Promise<Partial<Nft>> {
    try {
      const [getNft] = await this.nftModel.find({ address: nftAddress });
      return getNft as Partial<Nft>;
    } catch (err) {
      console.error("[NftRepository@getNftByAddress]:", (err as Error).message);
      throw err;
    }
  }

  async deleteNftByAddress(nftAddress: string): Promise<boolean> {
    try {
      await this.nftModel.deleteOne({ address: nftAddress });
      return true;
    } catch (err) {
      console.error(
        "[NftRepository@deleteNftByAddress]:",
        (err as Error).message
      );
      throw err;
    }
  }

  async getAllNft(): Promise<Partial<Nft>[]> {
    try {
      const getNft = await this.nftModel.find({});
      return getNft as Partial<Nft>[];
    } catch (err) {
      console.error("[NftRepository@getAllNft]:", (err as Error).message);
      throw err;
    }
  }

  async createNft(nft: Partial<Nft>): Promise<Partial<Nft>> {
    try {
      const newNft = await this.nftModel.create(nft);
      console.log(newNft.toObject());
      return newNft.toObject();
    } catch (err) {
      console.error("[NftRepository@createNft]:", (err as Error).message);
      throw err;
    }
  }
}
