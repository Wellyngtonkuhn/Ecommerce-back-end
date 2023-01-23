import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secret, expireIn } from "../jwt/config.js";
import AuthMidleware from "../middleware/AuthMidleware.js";
import Stripe from "stripe";

import { calcularPrecoPrazo } from 'correios-brasil'

import { ProductService } from "../services/products/index.js";
import { UserRegisterService } from "../services/users/userDataService/index.js";
import { UserCheckOutService } from "../services/users/checkoutService/index.js";
import { GetOrdersService } from "../services/users/getOrdersService/index.js";
import { UserFavoriteService } from "../services/users/favoriteService/index.js";


const route = express.Router();

const stripe = new Stripe(process.env.STRIPE_TESTE_TOKEN)

route.use(
  express.urlencoded({
    extended: true,
  })
);

route.use(express.json());

route.get("/", (req, res) => {
  res.send("Bem vindo a api de ecommerce");
});

// Rota para cadastrar os produtos
route.post("/newProduct", async (req, res) => {
  const {
    nome,
    modelo,
    tamanho,
    preco,
    quantidade,
    marca,
    descricao,
    url,
    imagens,
  } = req.body;
  const product = {
    nome,
    modelo,
    tamanho,
    preco,
    quantidade,
    marca,
    descricao,
    url,
    imagens,
  };

  const productService = new ProductService();
  await productService.create(product);
  return res.status(201).json(product);
});

// Rota para obter todos os produtos
route.get("/products", async (req, res) => {
  const productService = new ProductService();
  const product = await productService.findAll();
  if (product) {
    return res.status(200).json(product);
  }
  return res.status(404).json({ message: "Nenhum registro encontrado" });
});

// Rota para obter um produto
route.get("/products/:id", async (req, res) => {
  const id = req.params;
  const productService = new ProductService();
  const product = await productService.findById(id);
  if (product) {
    return res.status(200).json(product);
  }
  return res.status(404).json({ message: "Produto não encontrado" });
});

// Rota para consultar os prazos e preços da entrega
route.post('/checkout/delivery-time', AuthMidleware, async(req, res) => {
  const cepOrigen = '05537070'
  const { sCepDestino, nVlPeso, nCdFormato, nVlComprimento, nVlAltura, nVlLargura, nCdServico, nVlDiametro } = req.body
  // 04014 = SEDEX à vista
  // 04510 = PAC à vista
  // 40169 = SEDEX12 ( à vista e a faturar)
  let args = {
  sCepOrigem: cepOrigen,
  sCepDestino,
  nVlPeso, // kilo
  nCdFormato,
  nVlComprimento, // centimetros
  nVlAltura,
  nVlLargura,
  nCdServico,
  nVlDiametro
};

calcularPrecoPrazo(args)
  .then(response => res.status(200).json({ response }))
  .catch(err => res.status(400).json(err))
})

//Rota de Checkout
route.post("/checkout", AuthMidleware, async (req, res) => {
  const { userId, product, totalPrice, shipped, orderStatus, paymentStatus, deliveryTax  } = req.body;
  const orderItems = { userId, product, totalPrice, shipped, orderStatus, paymentStatus, deliveryTax }

  const userCheckOutService = new UserCheckOutService();  
   
  // TO DO - Implementar método de pagamento
  // Buscar o preço diretamente do bando de dados com o id do produto
  // Colocar a taxa de entrega no valor do stripe 

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: orderItems.product.map(item => {
        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: item.name,
            },
            unit_amount: (item.price * 100) + (deliveryTax ? deliveryTax * 100 : 0),
            },
            quantity: item.quantity,
          }
      }), 
      success_url: process.env.PROD_SUCCESS_URL,
      cancel_url:  process.env.PROD_CANCEL_URL
    })
    res.status(200).json(session)
  } catch (error) {
     return res.status(400).json(error)
  } 

       /* 
  if (orderItems.userId !== "") {
    try {
      const order = await userCheckOutService.createOrder(orderItems);
      return res.status(201).json({ message: "Pedido realizado", order });
    } catch (err) {
      return res.status(401).json({ message: err });
    }
  }
  return res.status(401).json({ message: "Campos obrigatórios" });
  */
});

// Rota para checar o status do pagamento e cadastrar o pedido no banco de dados
route.post('/checkout/webhook', async (req, res) => {
  const event = req.body

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      return res.json(paymentIntent)
    default:
     return res.json(`Unhandled event type ${event.type}`);
  }

})

// Login
route.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userRegisterService = new UserRegisterService();
  const userExist = await userRegisterService.findByEmail(email);

  if (!userExist || !(await bcrypt.compare(password, userExist.password))) {
    return res.status(400).json({ message: "Email ou senha incorreto!" });
  }

  return res.status(200).json({
    user: {
      id: userExist._id,
      name: userExist.name,
      email: userExist.email,
    },
    token: jwt.sign({ id: userExist._id }, secret, { expiresIn: expireIn }),
  });
});

// Register User
route.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const user = { name, email, password };
  user.password = await bcrypt.hash(user.password, 8);

  const userRegisterService = new UserRegisterService();
  const emailExist = await userRegisterService.findByEmail(email);

  if (!emailExist) {
    const userAdded = await userRegisterService.createUser(user);
    return res.status(201).json({
      user: {
        id: userAdded._id,
        name: userAdded.name,
        email: userAdded.email,
      },
      token: jwt.sign({ id: userAdded._id }, secret, { expiresIn: expireIn }),
      message: "Usuário cadastrado",
    });
  }
  return res.status(400).json({ message: "email já utilizado " });
});

//Rotas do dashboard do usuário

//Rota para obter todos os pedidos do usuário
route.get("/orders/:userId", AuthMidleware, async (req, res) => {
  const { userId } = req.params;
  const getOrdersService = new GetOrdersService();

  try {
    const userOrder = await getOrdersService.getOrders(userId);
    return res.status(200).json(userOrder);
  } catch {
    return res.status(404).json({ message: "Usuário não existe em nossa base de dados" });
  }
});

//Rota para adicionar favorito
route.post("/favorites", AuthMidleware, async (req, res) => {
  const { userId, productId, img, name, price } = req.body;
  const favorite = { userId, productId, img, name, price };

  const userFavoriteService = new UserFavoriteService();

  try {
    const favorites = await userFavoriteService.getFavorites(favorite?.userId);
    const isAdded = favorites.find(item => item.productId === favorite.productId)
      if(isAdded){
        return res.status(400).json({ message: 'Produto já adicionado' })
      }else{
        const addFavorite = await userFavoriteService.addFavorite(favorite);
        if(addFavorite._id){
          return res.status(201).json({ message: 'Ok', addFavorite })
        }
        return res.status(401).json({ message: 'Erro ao salvar favorito, tente novamente' })
      }
  }
  catch (error) {
      return res.status(400).json({ error })
  }
});

//Rota para obter os favoritos do usuário
route.get("/favorites/:id", AuthMidleware, async (req, res) => {
  const { id } = req.params;
  const userFavoriteService = new UserFavoriteService();

  if (id) {
    const favorites = await userFavoriteService.getFavorites(id);
    return res.status(200).json({ message: "ok", favorites });
  }
});

//Rota para Deletar um favorito
route.delete("/favorites/:id", AuthMidleware, async (req, res) => {
  const { id } = req.params;
  const userFavoriteService = new UserFavoriteService();

  try {
    const deleteFavorite = await userFavoriteService.deleteFavorite(id);
    if (deleteFavorite.deletedCount > 0) {
      return res.status(200).json({ message: "Favorito deletado" });
    }
    return res.status(404).json({message: 'Favorito não encontrado'})
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar, tente mais tarde", error });
  }
});

//Rota para Obter um usuário
route.get('/user/:id', AuthMidleware, async (req, res) =>{
  const { id } = req.params
  const userRegisterService = new UserRegisterService()

  try {
    const userExist = await userRegisterService.findById(id, '-password')

    if(!userExist) {
      return res.status(404).json({ message: 'Usuário inexistente '})
    }
    return res.status(200).json( userExist )
  } catch (error) {
    return res.status(500).json({ error })
  }
}) 

//Rota para Editar um usuário
route.patch('/user/:id', AuthMidleware, async (req, res) => {
  const { id } = req.params
  const { name, email, cellPhone, cpf, password, genre, cep, addressee, addresseeCpf, street, number, complement, district, city, state, reference } = req.body
  const user = { name, email, cellPhone, password, cpf, genre, cep, addressee, addresseeCpf, street, number, complement, district, city, state, reference }

    if(user.password !== undefined){
       user.password = await bcrypt.hash(user.password, 8);
    }

    const userRegisterService = new UserRegisterService()

  try {
    const userUpdated = await userRegisterService.upDate(id, user)
    
    if(userUpdated.matchedCount === 0){
      return res.status(404).json({ message: 'Usuário inexistente'})
    }
    return res.status(200).json({ message: 'Usuário atualizado', userUpdated})
  } catch (error) {
      return res.status(500).json({ message: 'Usuário inexistente', error })
  }
})

//Rota para Deletar um usuário
route.delete('/user/:id', AuthMidleware, async (req, res) => {
  const { id } = req.params
  const userRegisterService = new UserRegisterService()

  try {
    const deleteUser = await userRegisterService.deleteUser(id)
      if(deleteUser.deletedCount === 1){
        return res.status(200).json({ message: 'Usuário deletado'})
      }
      return res.status(404).json({ message: 'Usuário inexistente' })
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao deletar, tente mais tarde', error })
  } 
})


export default route;
