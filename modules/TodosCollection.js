class TodosCollection {
    constructor() {
        this.todos = []
    }

    push(value) {
        this.todos.push(value)
    }

    find(fieldName, value) {
        return todos.find(element => element[fieldName] == value)
    }

    size(statusFilter) {
        if (statusFilter == 'ALL')
            return todos.length
    
        return todos.filter(element => element.status == status[statusFilter]).length
    }

    get(statusFilter = '') {
        if (!statusFilter || statusFilter == 'ALL')
            return todos
    
        return todos.filter(element => element.status == status[statusFilter])
    }

    remove(todoId) {
        todos = todos.filter(element => element.id !== todoId)
    }
}

module.exports = TodosCollection