const { status } = require('./status')
const { find: findToDo } = require('./todosCollection')

function validateTitle(title) {
    return (!findToDo(title))
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

function validateFilter(filter) {
    return !(status[filter] == undefined)
}

module.exports = {
    validateCreateTodo,
    validateFilter
}