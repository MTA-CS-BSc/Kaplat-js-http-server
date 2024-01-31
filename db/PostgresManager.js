import {DataSource} from "typeorm";
import {POSTGRES_CONFIG} from './config.js'
import PostgresTodoEntity from "./entity/postgres/PostgresTodoEntity.js";
export const createPostgresManager = () => {
    const manager = new DataSource(POSTGRES_CONFIG)
    manager.initialize()

    const getRepo = () => {
        if (!manager.isInitialized)
            return null

        return manager.getRepository(PostgresTodoEntity)
    }

    return {
        getRepo
    }
}