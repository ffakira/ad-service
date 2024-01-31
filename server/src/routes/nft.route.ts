import express from "express";
import NftController from "../controllers/nft.controller";
import isAdmin from "../middlewares/isAdmin.middleware";

const router = express.Router();

router.get("/all", isAdmin, NftController.fetchAllNFT);
router.delete("/:address", isAdmin, NftController.deleteNFT);

export default router;
