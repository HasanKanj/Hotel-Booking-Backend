import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema(
  {
 
    city: {
      type: String,
      required: [true, "Please enter city"],
    },
    address: {
      type: String,
      required: true,
    },
    distance: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: [true, "Please enter  category"],
    },
    description: {
      type: String,
      required: [true, "Please enter  description"],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: [true, "Please enter  price"],
      default: 0,
    },
    location: {
      type: String,
      required: [true, "Please enter location"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    guests: {
      type: Number,
      required: [true, "Please enter number of guests"],
    },
    cheapestPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Hotels = mongoose.model("Hotels", HotelSchema);

export default Hotels;
