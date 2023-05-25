import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  CountUsers
} from "../contollers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//UPDATE
router.put("/:id", updateUser);

//DELETE
router.delete("/:id", deleteUser);

//GET
router.get("/:id", verifyUser, getUser);

//GET ALL
router.get("/", getUsers);

//count users
router.get("/count", CountUsers);


export default router;
