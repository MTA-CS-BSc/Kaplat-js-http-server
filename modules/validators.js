const status = require('./status')
const { find: findToDo } = require('./TodosCollection')

function validateTitle(todos, title) {
    return (!todos.find('title', title))
}

function validateDueDate(dueDate) {
    return new Date(dueDate) <= Date.now()
}

function validateCreateTodo(todos, todo) {
    let errorMessage = ''

    if (!validateTitle(todos, todo.title))
        errorMessage = `Error: TODO with the title ${todo.title} already exists in the system`

    else if (!validateDueDate(todo.dueDate))
        errorMessage = `Error: Can’t create new TODO that its due date is in the past`

    return errorMessage
}

function validateStatus(statusFilter, withAllKey = false) {
    const objectToCheck = withAllKey ? status[statusFilter] : (Object.keys(status).reduce((acc, key) => {
        if (key !== 'ALL')
            acc[key] = status[key]

        return acc
    }, {}))[statusFilter]

    return !(objectToCheck == undefined)
}

module.exports = {
    validateCreateTodo,
    validateStatus
}