import "dotenv/config";
import express from "express";
import route from "./src/routes/route.js";
const port = 3004 || "";
const app = express();

// Utiliza todas as rotas criadas
app.use(route);

// Iniciando o App

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
