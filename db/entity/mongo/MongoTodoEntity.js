import {EntitySchema} from "typeorm";
import MongoTodoSchema from "./MongoTodoSchema.js";

const entity = new EntitySchema(MongoTodoSchema)

export default entity