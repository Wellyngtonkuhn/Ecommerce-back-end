import Mongoose from "../../../db/index.js";

const userFavoriteSchema = new Mongoose.Schema(
  {
    userId: String,
    productId: String,
    img: String,
    name: String,
    price: Number,
  },
  {
    collection: "userFavorite",
    timestamps: true,
  }
);

export default Mongoose.model("userFavorite", userFavoriteSchema, "userFavorite");
