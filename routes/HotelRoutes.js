import express from "express";
import {
  getHotels,
  getHotelById,
  deleteHotel,
  createHotel,
  updateHotel,
  createHotelReview,
  getTopHotels,
  countByCity,
  countByType
} from "../contollers/HotelController.js";

const router = express.Router();

// Get all hotels and create a new hotel
router.route("/").get(getHotels).post(createHotel);

// Get a specific hotel by ID, update a specific hotel by ID, and delete a specific hotel by ID
router.route("/:id").get(getHotelById).delete(deleteHotel).put(updateHotel);

// Create a new review for a specific hotel by ID
router.route("/:id/reviews").post(createHotelReview);

// Get a list of top-rated hotels
router.get("/top", getTopHotels);

router.get("/countByCity", countByCity);
router.get("/countByType", countByType);

export default router;
