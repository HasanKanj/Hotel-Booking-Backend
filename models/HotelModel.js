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
    type: {
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


    description: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },

    rooms: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    }],
  
    featured: {
      type: Boolean,
      default: false,
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

// Update the Hotels model to include a static method for case-insensitive search
HotelSchema.statics.findByCity = function(city) {
  return this.find({ city: { $regex: new RegExp(city, "i") } });
};
const Hotels = mongoose.model("Hotels", HotelSchema);

export default Hotels;
