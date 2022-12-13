import { ObjectId } from "mongodb";
import userOrderSchema from "../../../schema/users/userCheckOutSchema/index.js";

export class GetOrdersService {
  async getOrders(id) {
    return await userOrderSchema.find({ userId: ObjectId(id) });
  }
}
