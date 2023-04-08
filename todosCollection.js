const { status } = require('./status')

const todos = []

function push(value) {
    todos.push(value)
}

function find(title) {
    return todos.find(element => element.title == title)
}

function size(filter) {
    if (filter == 'ALL')
        return todos.length

    return todos.filter(element => element.status == status[filter]).length
}

function get(filter) {
    if (filter == 'ALL')
        return todos

    return todos.filter(element => element.status == status[filter])
}

module.exports = {
    get,
    push,
    find,
    size
}