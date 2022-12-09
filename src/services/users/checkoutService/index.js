import userCheckOutShema from "../../../schema/users/userCheckOutShema/index.js";

export class UserCheckOutService {
  async createOrder(order) {
    return await userCheckOutShema.create(order);
  }
}
