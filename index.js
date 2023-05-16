import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import db from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import hotelRoutes from "./routes/HotelRoutes.js";
import roomRoutes from "./routes/RoomRoute.js";
import contactRoute from "./routes/contactRoute.js"
import morgan from "morgan";
import { OAuth2Client } from "google-auth-library";

// Load environment variables
dotenv.config();
mongoose.connect(process.env.MONGO_URL);
await db();
const app = express();
const PORT = process.env.PORT || 4000;
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

// Set up middleware
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up routes
app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use('/api/contact', contactRoute);

// Set up error handling middleware
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Start server
app.listen(PORT, () => {
  console.log(`API IS RUNNING ON PORT: ${PORT}`);
});
