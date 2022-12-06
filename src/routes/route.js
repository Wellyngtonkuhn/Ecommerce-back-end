import express from "express"
import bcrypt from 'bcrypt'
import jwt  from "jsonwebtoken"
import { secret, expireIn } from '../jwt/config.js'
import AuthMidleware from "../middleware/AuthMidleware.js"

import { ProductService } from "../services/products/index.js";
import { UserRegisterService } from "../services/users/userRegister.js";


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

// Login
route.post('/login', async (req, res) => {
    const { email, password } = req.body
 
    const userRegisterService = new UserRegisterService()
    const userExist = await userRegisterService.findByEmail(email)

    if(!userExist || !(await bcrypt.compare(password, userExist.password))){
      return res.status(400).json({ message: 'Email ou senha incorreto!'})
    }
    
    return res.status(200).json({
      user: {
        name: userExist.userName,
        email: userExist.email
      },
      token: jwt.sign(
        {id: userExist._id},
        secret,
        {expiresIn: expireIn}
        )
    })
})


// Register
route.post('/register', async (req, res) => {
    const { userName, email, password } = req.body
    const user = { userName, email, password }
    user.password = await bcrypt.hash(user.password, 8)
    
    const userRegisterService = new UserRegisterService()
    const emailExist = await userRegisterService.findByEmail(email)

    if(!emailExist){
      await userRegisterService.createUser(user)
       return res.status(200).json({ 
        message: 'Usuário cadastrado com sucesso!', 
        userName,
        email
      })
    }
    return res.status(401).json({ message: 'email já utilizado '})
})

// Rota para testar o JWT
route.get('/teste', AuthMidleware, (req, res)=>{
  return res.json({ message: 'bem vindo a rota protegida'})
})

export default route;
