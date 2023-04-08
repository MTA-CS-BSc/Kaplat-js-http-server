const todos = []

function push(value) {
    todos.push(value)
}

function find(title) {
    return todos.find(element => element.title == title)
}

module.exports = {
    push,
    find
}