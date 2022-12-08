import { ObjectId } from "mongodb";
import userRegisterModel from '../../schema/users/userRegisterSchema/index.js'

export class UserRegisterService {
  async createUser(user) {
    return await userRegisterModel.create(user);
  }

  async findById(id){
    return await userRegisterModel.findById({_id: ObjectId(id)})
  }

  async findByEmail(email) {
    return await userRegisterModel.findOne({ email: email });
  }
}
