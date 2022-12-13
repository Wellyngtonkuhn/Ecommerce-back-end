import "dotenv/config";
import express from "express";
import cors from 'cors'
import route from "./routes/route.js";

const port = process.env.PORT || 3004;
const app = express();

app.use(cors())


// Utiliza todas as rotas criadas
app.use(route);

// Iniciando o App

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
