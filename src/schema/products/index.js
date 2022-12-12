import Mongoose from "../../db/index.js";

const productSchema = new Mongoose.Schema(
  {
    nome: String,
    modelo: String,
    tamanho: String,
    preco: Number,
    quantidade: Number,
    marca: String,
    descricao: String,
    url: String,
    imagens: Array,
    unidadesVendidas: Number,
  },
  {
    collection: "products",
    timestamps: true,
  }
);

export default Mongoose.model("products", productSchema, "products");
