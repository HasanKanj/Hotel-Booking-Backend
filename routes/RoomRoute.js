import express from "express";
const router = express.Router();

import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  updateRoomAvailability,
} from "../contollers/RoomController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// Create a room for a hotel
router.post("/:hotelid", createRoom);

// Update room availability for a specific room by ID
router.put("/availability/:id", updateRoomAvailability);

// Update a specific room by ID
router.put("/:id", admin, updateRoom);

// Delete a specific room by ID and hotel ID
router.delete("/:id/:hotelid", deleteRoom);

// Get a specific room by ID
router.get("/:id", getRoom);

// Get all rooms
router.get("/", getRooms);


export default router;