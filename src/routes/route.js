import express from "express";
import { ProductService } from "../services/products/index.js";
const route = express.Router();

route.use(
  express.urlencoded({
    extended: true,
  })
);

route.use(express.json());

route.get('/', (req, res) => {
    res.send('Bem vindo a api de ecommerce')
})

// Rota para cadastrar os produtos
route.post("/newProduct", async (req, res) => {
  const { nome, modelo, tamanho, preco, quantidade, marca,descricao, url, imagens } = req.body;
  const product = { nome, modelo, tamanho, preco, quantidade, marca,descricao, url, imagens }

  const productService = new ProductService();
  await productService.create(product);
  return res.status(201).json(product);
});

// Rota para obter todos os produtos
route.get("/products", async (req, res) => {
  const productService = new ProductService()
  const product = await productService.findAll()
  if(product){
    return res.status(200).json(product)
  }
  return res.status(404).json({message: 'Nenhum registro encontrado'})
});

// Rota para obter um produto
route.get("/products/:id", async (req, res) => {
  const id = req.params
  const productService = new ProductService()
  const product = await productService.findById(id)
  if(product){
    return res.status(200).json(product)
  }
  return res.status(404).json({message: 'Produto não encontrado'})
});

export default route;
