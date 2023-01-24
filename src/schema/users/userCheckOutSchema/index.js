import Mongoose from "../../../db/index.js";

const userCheckOutSchema = new Mongoose.Schema(
  {
    userId: String,
    sessionIdPayment: String,
    paymentId: String,
    product: Array,
    totalPrice: Number,
    deliveryTax: Number,
    shipped: String,
    orderStatus: String,
    paymentStatus: String,
    addressed: Object
  },
  {
    collection: "userOders",
    timestamps: true,
  }
);

export default Mongoose.model("userOders", userCheckOutSchema, "userOders");
