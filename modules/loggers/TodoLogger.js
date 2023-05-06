const { makeLogger } = require("./GenericLoggerModule")

const todoLogger = makeLogger(false, 'logs/todos.log', 'info', 'todo-logger')

module.exports = {
    todoLogger
}
