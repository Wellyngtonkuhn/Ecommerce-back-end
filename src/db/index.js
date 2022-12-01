import mongoose from "mongoose";

const url = process.env.MONGODB_URL_CONNECTION_STRING

mongoose.connect(url).then(()=> {
    console.log("Conectado ao banco de dados")
}).catch(err => console.log(err))



export default mongoose