const { find: findToDo } = require('./todosCollection')

function validateTitle(title) {
    if (!findToDo(title)) return true

    return false
}

function validateDueDate(dueDate) {
    return new Date(dueDate) <= Date.now()
}

function validateCreateTodo(todo) {
    let errorMessage = ''

    if (!validateTitle(todo.title))
        errorMessage = `Error: TODO with the title ${todo.title} already exists in the system`

    else if (!validateDueDate(todo.dueDate))
        errorMessage = `Error: Can’t create new TODO that its due date is in the past`

    return errorMessage
}

module.exports = {
    validateCreateTodo
}