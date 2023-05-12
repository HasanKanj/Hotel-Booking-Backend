import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true,
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
      required: true
    },
    description: {
      type: String,
      required: true
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
    rooms:{
     type:[String]
    },
    price: {
      type: String,
      required: true,
      default: 0,
    },
    location: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    guests: {
      type: Number,
      required: true,
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
