import express from "express";
import {
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getHotel,
  getHotelRooms,
  getHotels,
  updateHotel,
  getHotelRoomCount
} from "../contollers/HotelController.js";
const router = express.Router();

// : Create a new hotel
router.post("/", createHotel);

// Update an existing hotel by ID
router.put("/:id", updateHotel);

// Delete an existing hotel by ID
router.delete("/:id", deleteHotel);

//  Retrieve a specific hotel by ID
router.get("/find/:id", getHotel);

//  Retrieve all hotels
router.get("/", getHotels);

//  Retrieve all hotels
router.get("/count", getHotelRoomCount);

//  Retrieve the count of hotels by city
router.get("/countByCity", countByCity);

//  Retrieve the count of hotels by type
router.get("/countByType", countByType);

//  Retrieve all rooms for a specific hotel by ID
router.get("/room/:id", getHotelRooms);



export default router;
