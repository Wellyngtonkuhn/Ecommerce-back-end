import userCheckOutSchema from "../../../schema/users/userCheckOutSchema/index.js";

export class UserCheckOutService {
  async createOrder(order) {
    return await userCheckOutSchema.create(order);
  }
}
