import express from "express";
const router = express.Router();

import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  updateRoomAvailability,
  getRoomCount
} from "../contollers/RoomController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

// Create a room for a hotel
router.post("/:hotelid",protect, createRoom);

// Get all count
router.get("/count", getRoomCount);

// Update room availability for a specific room by ID
router.put("/availability/:id", updateRoomAvailability);

// Update a specific room by ID
router.put("/:id", updateRoom);

// Delete a specific room by ID and hotel ID
router.delete("/:id/:hotelid", deleteRoom);

// Get a specific room by ID
router.get("/:id", getRoom);

// Get all rooms
router.get("/", getRooms);




export default router;