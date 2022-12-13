import express from "express"
import bcrypt from 'bcrypt'
import jwt  from "jsonwebtoken"
import { secret, expireIn } from '../jwt/config.js'
import AuthMidleware from "../middleware/AuthMidleware.js"

import { ProductService } from "../services/products/index.js";
import { UserRegisterService } from "../services/users/userRegister.js";
import { UserCheckOutService } from '../services/users/checkoutService/index.js'
import { GetOrdersService } from "../services/users/getOrdersService/index.js"


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

//Rota de Checkout
route.post('/checkout', AuthMidleware, async (req, res) => {
  const { userId, product, totalPrice, shipped, orderStatus, paymentStatus } = req.body
  const orderItems = { userId, product, totalPrice, shipped, orderStatus, paymentStatus }

  const userCheckOutService = new UserCheckOutService()

    // TO DO - Implementar método de pagamento
   
    if(orderItems.userId !== ''){
      try {
        const order = await userCheckOutService.createOrder(orderItems)
        return res.status(201).json({ message: 'Pedido realizado', order})
      } catch (err) {
          return res.status(401).json({ message: err})
        }
    }
    return res.status(401).json({ message: 'Campos obrigatórios'})
})

// Login
route.post('/login', async (req, res) => {
    const { email, password } = req.body
 
    const userRegisterService = new UserRegisterService()
    const userExist = await userRegisterService.findByEmail(email)

    if(!userExist || !(await bcrypt.compare(password, userExist.password))){
      return res.status(400).json({ message: 'Email ou senha incorreto!'})
    }
    
      return res.status(200).send('Olá').json({
        user: {
        id: userExist._id,
        userName: userExist.userName,
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
      const userAdded = await userRegisterService.createUser(user)
       return res.status(201).json({
        user:{
          id: userAdded._id,
          userName: userAdded.userName,
          email: userAdded.email
        },
        token: jwt.sign(
          {id: userAdded._id},
          secret,
          {expiresIn: expireIn}
        ),
        message: 'Usuário cadastrado'
       })
    }
    return res.status(400).json({ message: 'email já utilizado '})
})

  //Rotas do dashboard do usuário
  
//Rota para obter todos os pedidos do usuário
route.get('/orders/:userId', AuthMidleware, async (req, res) => {
    const { userId } = req.params
    const getOrdersService = new GetOrdersService()

    try {
        const userOrder = await getOrdersService.getOrders(userId)
          return res.status(200).json(userOrder)
    } catch{
       return res.status(404).json({message: 'Usuário não existe em nossa base de dados'})
    }
})

export default route;