import Mongoose from "../../../db/index.js";

const userCheckOutShema = new Mongoose.Schema(
  {
    userId: String,
    productImg: Array,
    totalPrice: String,
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
