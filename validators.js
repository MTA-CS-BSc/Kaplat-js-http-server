const { status } = require('./status')
const { find: findToDo } = require('./todosCollection')

function validateTitle(title) {
    return (!findToDo('title', title))
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

function validateStatus(filter, withAllKey = false) {
    const objectToCheck = withAllKey ? status[filter] : (Object.keys(status).reduce((acc, key) => {
        if (key !== 'ALL')
            acc[key] = status[key]

        return acc
    }, {}))

    return !(objectToCheck == undefined)
}

module.exports = {
    validateCreateTodo,
    validateStatus
}