const status = require('../modules/status')

class TodosCollection {
    constructor() {
        this.todos = []
    }

    push(value) {
        this.todos.push(value)
    }

    find(fieldName, value) {
        return this.todos.find(element => element[fieldName] == value)
    }

    size(statusFilter = '') {
        if (!statusFilter || statusFilter == 'ALL')
            return this.todos.length
    
        return this.todos.filter(element => element.status == status[statusFilter]).length
    }

    get(statusFilter = '') {
        if (!statusFilter || statusFilter == 'ALL')
            return this.todos
    
        return this.todos.filter(element => element.status == status[statusFilter])
    }

    remove(todoId) {
        this.todos = this.todos.filter(element => element.id !== todoId)
    }
}

module.exports = TodosCollection