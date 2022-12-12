import Mongoose from "../../../db/index.js";

const userCheckOutShema = new Mongoose.Schema(
  {
    userId: String,
    product: Array,
    totalPrice: Number,
    shipped: String,
    orderStatus: String,
    paymentStatus: String,
  },
  {
    collection: "userOders",
    timestamps: true,
  }
);

export default Mongoose.model("userOders", userCheckOutShema, "userOders");
