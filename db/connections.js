import {DataSource} from "typeorm";
import TodoEntity from "../entity/mongo/MongoTodoEntity.js";

export const POSTGRES_CONNECTION = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'docker',
    database: 'todos',
    // entities: [ TodoEntity ]
});

export const MONGO_CONNECTION = new DataSource({
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'todos',
    entities: [ TodoEntity ]
});

await POSTGRES_CONNECTION.initialize();
await MONGO_CONNECTION.initialize();
