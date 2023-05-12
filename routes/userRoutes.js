import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../contollers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// Create a new user
router.route("/post").post(registerUser);

// Get all users
router.route("/").get(getUsers);

// Authenticate a user
router.post("/login", authUser);

// Get the current user's profile
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Delete a user
router
  .route("/:id")
  .delete(protect, admin, deleteUser)

// Get a user by ID
router
  .route("/:id")
  .get(protect, admin, getUserById)

// Update a user
router
  .route("/:id")
  .put(protect, admin, updateUser);

export default router;

