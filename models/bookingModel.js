import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: date,
      required: true,
    },
    guest: {
      type: number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookSchema)

export default User
