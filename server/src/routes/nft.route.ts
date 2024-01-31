import express from "express";
import NftController from "../controllers/nft.controller";

const router = express.Router();

router.get("/all", NftController.fetchAllNFT);
router.delete("/:address", NftController.deleteNFT);

export default router;
