const { status } = require('./status')

let todos = []

function push(value) {
    todos.push(value)
}

function find(fieldName, value) {
    return todos.find(element => element[fieldName] == value)
}

function size(filter) {
    if (filter == 'ALL')
        return todos.length

    return todos.filter(element => element.status == status[filter]).length
}

function get(filter = '') {
    if (!filter || filter == 'ALL')
        return todos

    return todos.filter(element => element.status == status[filter])
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