import express from "express";
import AirdropController from "../controllers/airdrop.controller";
import isAdmin from "../middlewares/isAdmin.middleware";
import isAuth from "../middlewares/isAuth.middleware";

const router = express.Router();

router.post("/new", isAdmin, AirdropController.airdropNFT);
router.post("/redeem/new", isAdmin, AirdropController.generateReedemCode);
router.put("/redeem/:airdropId", isAdmin, AirdropController.updateRecipientAddress);
router.post("/redeem/nft/:address", isAuth, AirdropController.redeemNftCode);
router.get("/redeem/nft/:address", isAdmin, AirdropController.getNftAddress);

export default router;
