import express from "express";
import {
  getHotels,
  getHotelById,
  deleteHotel,
  createHotel,
  updateHotel,
  createHotelReview,
  getTopHotels,
} from "../contollers/HotelController.js";

const router = express.Router();

router.route("/").get(getHotels).post(createHotel);
router.route("/:id").get(getHotelById).delete(deleteHotel).put(updateHotel);
router.route("/:id/reviews").post(createHotelReview);
router.get("/top", getTopHotels);

export default router;
