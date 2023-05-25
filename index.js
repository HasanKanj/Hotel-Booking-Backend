import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import db from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelRoutes from "./routes/HotelRoutes.js";
import roomRoutes from "./routes/RoomRoute.js";
import contactRoute from "./routes/contactRoute.js"
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { OAuth2Client } from "google-auth-library";

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL);
await db();

// Set up middleware
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(express.json());

// Set up routes
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use('/api/contact', contactRoute);

// Set up error handling middleware
app.use(notFound);
app.use(errorHandler);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Start server
app.listen(PORT, () => {
  console.log(`API IS RUNNING ON PORT: ${PORT}`);
});
