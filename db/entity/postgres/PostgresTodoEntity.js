import {EntitySchema} from "typeorm";
import PostgresTodoSchema from "./PostgresTodoSchema.js";

const entity = new EntitySchema(PostgresTodoSchema)

export default entity