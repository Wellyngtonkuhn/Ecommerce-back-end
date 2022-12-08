import { ObjectId } from "mongodb";
import userOrderSchema from "../../../schema/users/userOrdersShema/index.js";
import ProductModel from "../../../schema/products/index.js";

export class GetOrdersService {
  async getOrders(id) {
    return await userOrderSchema.find({ userId: ObjectId(id) });
  }
}

export class GetOrdersItemsService {
  async getOrdersItems(ids) {
    return await ProductModel.find({ _id: { $in: ids } });
  }
}
