import { Request, Response } from "express";
import { constants as c } from "node:http2";
import { ZodError } from "zod";
import { generateReferralCode } from "../services/generateReferralCode.service";
import NftRepository from "../repositories/nft.repository";
import AirdropRepository from "../repositories/airdrop.repository";

export default class AirdropController {
  private static nftRepository = new NftRepository();
  private static airdropRepository = new AirdropRepository();

  static async airdropNFT(req: Request, res: Response) {
    const { contractAddress, recipient, quantity } = req.body;

    return res.status(c.HTTP_STATUS_OK).json({
      status: c.HTTP_STATUS_OK,
      data: {
        contractAddress: "string",
        recipient: "string",
        quantity: 1,
      },
    });
  }

  static async generateReedemCode(req: Request, res: Response) {
    try {
      const { nftAddress, quantity, chain } = req.body;
      const createNft = await AirdropController.nftRepository.createNft({
        address: nftAddress,
        chain,
      });
      const nftId = createNft._id;

      const getCodes = generateReferralCode(+quantity);
      getCodes.map(async (code: string) => {
        await AirdropController.airdropRepository.createAirdrop({
          nft: nftId,
          redeemCode: code,
        });
      });

      res.status(c.HTTP_STATUS_OK).json({
        status: c.HTTP_STATUS_OK,
        data: {
          code: getCodes,
        },
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(c.HTTP_STATUS_BAD_REQUEST).json({
          status: c.HTTP_STATUS_BAD_REQUEST,
          error: {
            message: err.errors,
          },
        });
      } else {
        console.error(
          "[AidropController@generateReedemCode]:",
          (err as Error).message
        );
        return res.status(c.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
          status: c.HTTP_STATUS_INTERNAL_SERVER_ERROR,
          error: {
            message: (err as Error).message,
          },
        });
      }
    }
  }

  static async getNftAddress(req: Request, res: Response) {
    const { address } = req.params;
    if (!address) {
      return res.status(c.HTTP_STATUS_BAD_REQUEST).json({
        status: c.HTTP_STATUS_BAD_REQUEST,
        error: {
          message: "No params provided",
        },
      });
    } else {
      try {
        const filterNftAirdrop =
          await AirdropController.airdropRepository.filterNftAirdrop(address);
        return res.status(c.HTTP_STATUS_OK).json({
          status: c.HTTP_STATUS_OK,
          data: {
            nft: filterNftAirdrop,
          },
        });
      } catch (err) {
        console.error(
          "[AirdropController@getNftAddress]:",
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
  }

  static async updateRecipientAddress(req: Request, res: Response) {
    try {
      const { airdropId } = req.params;
      const { recipientAddress } = req.body;

      if (!airdropId || !recipientAddress) {
        return res.status(c.HTTP_STATUS_BAD_REQUEST).json({
          status: c.HTTP_STATUS_BAD_REQUEST,
          error: {
            message: "No params or body provided",
          },
        });
      } else {
        const updateAddress =
          await AirdropController.airdropRepository.updateRecipientAddress(
            airdropId,
            recipientAddress
          );
        console.log(updateAddress);
        return res.status(c.HTTP_STATUS_OK).json({
          status: c.HTTP_STATUS_OK,
          data: {
            message: "Ok",
          },
        });
      }
    } catch (err) {
      console.error(
        "[AirdropController@updateRecipientAddress]:",
        (err as Error).message
      );
    }
  }

  static async redeemNftCode(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const { recipientAddress, code } = req.body;

      if (!address || !recipientAddress || !code) {
        return res.status(c.HTTP_STATUS_BAD_REQUEST).json({
          status: c.HTTP_STATUS_BAD_REQUEST,
          error: {
            message: "No params or body provided",
          },
        });
      }

      /** @dev by default recipientAddress is stored as 0x0 address in mongodb */
      if (recipientAddress === "0x0000000000000000000000000000000000000000") {
        return res.status(c.HTTP_STATUS_BAD_REQUEST).json({
          status: c.HTTP_STATUS_BAD_REQUEST,
          error: {
            message: "Invalid address",
          },
        });
      }

      /** @dev check if redeem code already been claimed */
      const getRedeemed =
        await AirdropController.airdropRepository.getAirdropByCodeAndAddress(
          address,
          recipientAddress,
          code
        );

      if (getRedeemed === null) {
        return res.status(c.HTTP_STATUS_NOT_FOUND).json({
          status: c.HTTP_STATUS_NOT_FOUND,
          error: {
            message: "Invalid code or wallet address not found",
          },
        });
      }

      if (getRedeemed.isClaimed) {
        return res.status(c.HTTP_STATUS_CONFLICT).json({
          status: c.HTTP_STATUS_CONFLICT,
          error: {
            message: "This code already been claimed",
          },
        });
      }

      /** @dev updates the code to be claimed */
      const redeemCode = await AirdropController.airdropRepository.redeemCode(
        address,
        recipientAddress,
        code
      );

      if (redeemCode === null) {
        return res.status(c.HTTP_STATUS_NOT_FOUND).json({
          status: c.HTTP_STATUS_NOT_FOUND,
          error: {
            message: "Invalid code or wallet address not found",
          },
        });
      }

      return res.status(c.HTTP_STATUS_OK).json({
        status: c.HTTP_STATUS_OK,
        data: {
          message: "Claimed",
        },
      });
    } catch (err) {
      console.error(
        "[AirdropController@redeemNftCode]:",
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
}
