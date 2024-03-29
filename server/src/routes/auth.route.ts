import express from "express";
import AuthController from "../controllers/auth.controller";
import isAuth from "../middlewares/isAuth.middleware";

const router = express.Router();

/** @dev get total users*/
router.get("/all", AuthController.getAllUsers);

/** @dev session information about the user*/
router.get("/session", isAuth, AuthController.session);

/** @dev authenticate username */
router.post("/login", AuthController.login);

/** @dev register a new user */
router.post("/register", AuthController.register);

/** @dev logout user */
router.delete("/logout", AuthController.logout);

export default router;
