import { ObjectId } from "mongodb";
import userOrderModel from "../../../schema/users/userOrdersShema/index.js";


export class UserOrderService {
    async createOrder(order){
        return await userOrderModel.create(order)
    }
}
