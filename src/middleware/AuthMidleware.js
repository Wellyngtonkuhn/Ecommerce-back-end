import jwt from "jsonwebtoken";
import { secret } from "../jwt/config.js";
import { promisify } from "util";

const AuthMidleware = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ message: "Faça login para continuar" });
  }

  const [, token] = auth.split(" ");

  try {
    const decodedToken = await promisify(jwt.verify)(token, secret);

    if (!decodedToken) {
      return res
        .status(401)
        .json({ message: "Token expirado, faça login para continuar" });
    } else {
      req.user_id = decodedToken.id;
      next();
    }
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
};

export default AuthMidleware;
