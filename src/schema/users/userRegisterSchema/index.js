import Mongoose from "../../../db/index.js";

const userRegisterSchema = new Mongoose.Schema(
  {
    name: String,
    email: String,
    cellPhone: String,
    cpf: String,
    genre: String,
    password: String,
    cep: String,
    addressee: String,
    addresseeCpf: String,
    street: String,
    number: String,
    complement: String,
    district: String,
    city: String,
    state: String,
    reference: String
  },
  {
    collection: "user",
    timestamps: true,
  }
);

export default Mongoose.model("user", userRegisterSchema, "user");
