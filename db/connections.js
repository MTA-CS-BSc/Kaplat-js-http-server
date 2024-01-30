import {DataSource} from "typeorm";
import MongoTodoEntity from "../entity/mongo/MongoTodoEntity.js";
import {setId} from "../modules/IdGenerator.js";

export const POSTGRES_CONNECTION = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'docker',
    database: 'todos',
});

export const MONGO_CONNECTION = new DataSource({
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'todos',
    entities: [ MongoTodoEntity ]
});

await POSTGRES_CONNECTION.initialize();
await MONGO_CONNECTION.initialize();

MONGO_CONNECTION.getRepository(MongoTodoEntity).count().then((amount) => setId(amount))
