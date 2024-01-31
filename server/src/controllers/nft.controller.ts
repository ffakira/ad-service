import { Request, Response } from "express";
import { constants as c } from "node:http2";
import NftRepository from "../repositories/nft.repository";
import AirdropRepository from "../repositories/airdrop.repository";

export default class NftController {
  private static nftRepository = new NftRepository();
  private static airdropRepository = new AirdropRepository();

  static async fetchAllNFT(req: Request, res: Response) {
    try {
      const getAllNft = await NftController.nftRepository.getAllNft();
      return res.status(c.HTTP_STATUS_OK).json({
        status: c.HTTP_STATUS_OK,
        data: getAllNft,
      });
    } catch (err) {
      console.error("[NftController@fetchAllNFT]:", (err as Error).message);
      return res.status(c.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        status: c.HTTP_STATUS_INTERNAL_SERVER_ERROR,
        error: {
          message: "Internal server error",
        },
      });
    }
  }

  static async getTotalRedeemCode(req: Request, res: Response) {
    try {
      // const totalRedeemCode = await NftController.airdropRepository.
      return res.status(c.HTTP_STATUS_OK).json({
        status: c.HTTP_STATUS_OK,
        data: "Ok",
      });
    } catch (err) {
      console.error(
        "[NftController@getTotalRedeemCode]",
        (err as Error).message
      );
      return res.status(c.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        status: c.HTTP_STATUS_INTERNAL_SERVER_ERROR,
        error: {
          message: "Internal server error",
        },
      });
    }
  }

  static async deleteNFT(req: Request, res: Response) {
    const { address } = req.params;

    if (!address) {
      return res.status(c.HTTP_STATUS_BAD_REQUEST).json({
        status: c.HTTP_STATUS_BAD_REQUEST,
        error: {
          message: "No address provided",
        },
      });
    } else {
      try {
        const deleteAllAirdrop =
          await NftController.airdropRepository.deleteAllAirdrop(address);

        /** @dev succesfully delete all airdrops, proceeds to delete NFT */
        if (deleteAllAirdrop) {
          await NftController.nftRepository.deleteNftByAddress(address);
          return res.status(c.HTTP_STATUS_OK).json({
            status: c.HTTP_STATUS_OK,
            data: {
              message: "Sucessfully deleted NFT & Airdrop",
            },
          });
        } else {
          /**
           * @dev Failed to delete airdrop, therefore don't delete NFT. To avoid
           *      dangling airdrops in mongodb.
           */
          return res.status(c.HTTP_STATUS_FAILED_DEPENDENCY).json({
            status: c.HTTP_STATUS_FAILED_DEPENDENCY,
            error: {
              message: "Failed to delete all airdrops. Cannot delete NFT.",
            },
          });
        }
      } catch (err) {
        console.error("[NftController@deleteNft]:", (err as Error).message);
        return res.status(c.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
          status: c.HTTP_STATUS_INTERNAL_SERVER_ERROR,
          error: {
            message: "Internal server error",
          },
        });
      }
    }
  }
}
