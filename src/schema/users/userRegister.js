import Mongoose from "../../db/index.js";

const userRegisterSchema = new Mongoose.Schema(
  {
    userName: String,
    email: String,
    password: String,
  },
  {
    collection: "user",
    timestamps: true,
  }
);

export default Mongoose.model("user", userRegisterSchema, "user");
