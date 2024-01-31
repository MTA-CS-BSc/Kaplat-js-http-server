import MongoTodoEntity from "./entity/mongo/MongoTodoEntity.js";
import PostgresTodoEntity from "./entity/postgres/PostgresTodoEntity.js";

export const POSTGRES_CONFIG = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'docker',
    database: 'todos',
    entities: [ PostgresTodoEntity ]
}

export const MONGO_CONFIG = {
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'todos',
    entities: [ MongoTodoEntity ]
}