import { ObjectId } from "mongodb";
import ProductModel from "../../schema/products/index.js";

export class ProductService {
  async create(product) {
   await ProductModel.create(product)
  }
  // Finalizar o update de venda do produto
  // async edit(id, unitsSold, produtctQuantity) {
  //   await ProductModel.updateMany(product)
  //  }

  async findAll(){
    return await ProductModel.find({})
  }

  async findById(id){
    return await ProductModel.findById({_id: ObjectId(id)})
  }
}
