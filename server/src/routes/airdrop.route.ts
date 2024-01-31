import express from "express";
import AirdropController from "../controllers/airdrop.controller";
import isAdmin from "../middlewares/isAdmin.middleware";

const router = express.Router();

router.post("/new", isAdmin, AirdropController.airdropNFT);
router.post("/redeem/new", AirdropController.generateReedemCode);
router.put("/redeem/:airdropId", AirdropController.updateRecipientAddress);
router.post("/redeem/nft/:address", AirdropController.redeemNftCode);
router.get("/redeem/nft/:address", AirdropController.getNftAddress);

export default router;
