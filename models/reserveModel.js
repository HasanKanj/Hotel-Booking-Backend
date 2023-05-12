import mongoose from "mongoose";

const reserveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reservedplaces: [
      {
     
        price: { type: Number, required: true },
        room: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Room",
        },
      },
    ],

    paymentMethod: {
      type: String,
      required: true,
    },

    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  {
    timestamps: true,
  }
);

const Reserve = mongoose.model("Reserve", reserveSchema);

export default Reserve;
