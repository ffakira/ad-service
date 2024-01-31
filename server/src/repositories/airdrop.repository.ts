import { Model } from "mongoose";
import AirdropModel, {
  Airdrop,
  AirdropDocument,
} from "../models/airdrop.model";
import NftRepository from "./nft.repository";

export default class AirdropRepository {
  private airdropModel: Model<AirdropDocument>;
  private nftRepository = new NftRepository();

  constructor() {
    this.airdropModel = AirdropModel as Model<AirdropDocument>;
  }

  async getAirdropById(airdropId: string): Promise<Partial<Airdrop> | null> {
    try {
      const airdrop = await this.airdropModel.findById(airdropId).lean();
      return airdrop ? (airdrop as Partial<Airdrop>) : null;
    } catch (err) {
      console.error(
        "[AirdropRepository@getAirdropById]:",
        (err as Error).message
      );
      throw err;
    }
  }

  async getAirdropByCodeAndAddress(
    nftAddress: string,
    recipientAddress: string,
    redeemCode: string
  ): Promise<Partial<Airdrop> | null> {
    try {
      const getNftAddress = await this.nftRepository.getNftByAddress(
        nftAddress
      );
      const filter = { nft: getNftAddress._id, recipientAddress, redeemCode };
      const airdrop = await this.airdropModel.findOne(filter);

      return airdrop ? (airdrop as Partial<Airdrop>) : null;
    } catch (err) {
      console.error(
        "[AirdropRepository@getAirdropByCodeAndAddress]:",
        (err as Error).message
      );
      throw err;
    }
  }

  async createAirdrop(airdrop: Partial<Airdrop>): Promise<Partial<Airdrop>> {
    try {
      const newAirdrop = await this.airdropModel.create(airdrop);
      return newAirdrop.toObject();
    } catch (err) {
      console.error(
        "[AirdropRepository@createAirdrop]:",
        (err as Error).message
      );
      throw err;
    }
  }

  async updateRecipientAddress(
    id: string,
    recipientAddress: string
  ): Promise<Partial<Airdrop>> {
    try {
      const filter = { _id: id };
      const update = { recipientAddress };
      const updateAirdrop = await this.airdropModel.findOneAndUpdate(
        filter,
        update,
        { new: true }
      );
      return updateAirdrop?.toObject() as Partial<Airdrop>;
    } catch (err) {
      console.error(
        "[AirdropRepository@updateRecipientAddress]:",
        (err as Error).message
      );
      throw err;
    }
  }

  async filterNftAirdrop(nftAddress: string): Promise<Partial<Airdrop[]>> {
    try {
      const getNftAddress = await this.nftRepository.getNftByAddress(
        nftAddress
      );
      const filterAirdrop = await this.airdropModel.find({
        nft: getNftAddress._id,
      });
      return filterAirdrop;
    } catch (err) {
      console.error(
        "[AirdropRepository@filterNftAirdrop]:",
        (err as Error).message
      );
      throw err;
    }
  }

  async deleteAllAirdrop(nftAddress: string): Promise<boolean> {
    try {
      const getNftAddress = await this.nftRepository.getNftByAddress(
        nftAddress
      );
      const deleteAirdrop = await this.airdropModel.deleteMany({
        nft: getNftAddress._id,
      });
      console.log(deleteAirdrop);
      return true;
    } catch (err) {
      console.error(
        "[AirdropRepository@deleteAllAirdrop]:",
        (err as Error).message
      );
      throw err;
    }
  }

  async redeemCode(
    nftAddress: string,
    recipientAddress: string,
    redeemCode: string
  ): Promise<Partial<Airdrop> | null> {
    try {
      const getNftAddress = await this.nftRepository.getNftByAddress(
        nftAddress
      );
      const filter = {
        nft: getNftAddress._id,
        recipientAddress,
        redeemCode,
      };
      const update = { isClaimed: true, updatedAt: new Date() };
      const updateCode = await this.airdropModel.findOneAndUpdate(
        filter,
        update,
        { new: true }
      );
      return updateCode ? (updateCode as Partial<Airdrop>) : null;
    } catch (err) {
      console.error("[AirdropRepository@redeemCode]:", (err as Error).message);
      throw err;
    }
  }
}
