import express from "express";
import { login, register,signup,googleLogin } from "../contollers/auth.js";

const router = express.Router();
router.post("/signup", signup)
router.post("/googlelogin", googleLogin)

router.post("/register", register)
router.post("/login", login)

export default router