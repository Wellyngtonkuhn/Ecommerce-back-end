import Mongoose from "../../../db/index.js";

const userOrderSchema = new Mongoose.Schema(
  {
    userId: String,
    product: Array,
  },
  {
    collection: "userOders",
    timestamps: true,
  }
);

export default Mongoose.model("userOders", userOrderSchema, "userOders");
