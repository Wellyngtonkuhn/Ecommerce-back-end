import { ObjectId } from 'mongodb'
import userFavoriteSchema from '../../../schema/users/userFavoriteSchema/index.js'

export class UserFavoriteService {
    async addFavorite(favorite){
        return await userFavoriteSchema.create(favorite)
    }

    async getFavorites(id){
        return await userFavoriteSchema.find({userId: ObjectId(id)})
    }
}