import express from "express";
import { register, login, logoutUser, refreshToken } from "../controller/authController.js";

 const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshToken);


export default router;