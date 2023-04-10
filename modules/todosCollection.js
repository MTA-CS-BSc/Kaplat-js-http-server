const { status } = require('./status')

let todos = []

function push(value) {
    todos.push(value)
}

function find(fieldName, value) {
    return todos.find(element => element[fieldName] == value)
}

function size(statusFilter) {
    if (statusFilter == 'ALL')
        return todos.length

    return todos.filter(element => element.status == status[statusFilter]).length
}

function get(statusFilter = '') {
    if (!statusFilter || statusFilter == 'ALL')
        return todos

    return todos.filter(element => element.status == status[statusFilter])
}

function remove(todoId) {
    todos = todos.filter(element => element.id !== todoId)
}

module.exports = {
    get,
    push,
    find,
    remove,
    size
}