import { makeLogger } from "./GenericLoggerModule.js"

export default makeLogger(false, 'logs/todos.log', 'info', 'todo-logger')