import Mongoose from "../../../db/index.js";

const userRegisterSchema = new Mongoose.Schema(
  {
    name: String,
    email: String,
    cellPhone: String,
    cpf: String,
    genre: String,
    password: String,
  },
  {
    collection: "user",
    timestamps: true,
  }
);

export default Mongoose.model("user", userRegisterSchema, "user");
