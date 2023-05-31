import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  CountUsers
} from "../contollers/user.js";

const router = express.Router();

// Count users
router.get("/count", CountUsers);

// Update user
router.put("/:id", updateUser);

// Delete user
router.delete("/:id", deleteUser);

// Get user
router.get("/:id", getUser);

// Get all users
router.get("/", getUsers);

export default router;