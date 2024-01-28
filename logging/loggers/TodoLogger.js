import { makeLogger } from "./GenericLoggerModule.js"

export default makeLogger(false, 'logging/logs/todos.log', 'info', 'todo-logger')