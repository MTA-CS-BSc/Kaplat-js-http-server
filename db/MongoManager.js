import {DataSource} from "typeorm";
import {MONGO_CONFIG} from './config.js'
import MongoTodoEntity from "./entity/mongo/MongoTodoEntity.js";
export const createMongoManager = () => {
    const manager = new DataSource(MONGO_CONFIG)
    manager.initialize()

    const getRepo = () => {
        if (!manager.isInitialized)
            return null

        return manager.getRepository(MongoTodoEntity)
    }

    return {
        getRepo
    }
}