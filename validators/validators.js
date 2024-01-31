import status from '../dicts/status.js'

export const validateTitle = (todos, title) => {
    return !todos.some(todo => todo.title === title)
}

export const validateDueDate = (dueDate) => {
    return dueDate > Date.now()
}

export const validateStatus = (statusFilter, withAllKey = false) => {
    return withAllKey ? Object.keys(status).includes(statusFilter)
        : Object.keys(status).filter(element => element !== 'ALL').includes(statusFilter)
}

const validateTodoDetails = (todos, todo) => {
    let errorMessage = ''

    if (!validateTitle(todos, todo.title))
        errorMessage = `Error: TODO with the title ${todo.title} already exists in the system`

    else if (!validateDueDate(todo.duedate))
        errorMessage = `Error: Can’t create new TODO that its due date is in the past`

    return errorMessage
}

export const validateCreateTodo = ({ error, value, todos }) => {
    const errMessage = error ? `Error: ${error.details[0]?.message}` : validateTodoDetails(todos, value)
    return { valid: !errMessage, errorMessage: errMessage }
}

export const validateContentParams = (filter, sortBy, persistenceMethod) => {
    let errMessage = ''

    if (!filter || !validateStatus(filter, true))
        errMessage = 'Error: Invalid status'
        
    if (sortBy !== '' && !(['DUE_DATE', 'ID', 'TITLE'].includes(sortBy)))
        errMessage = 'Error: Invalid sort by'

    if (!persistenceMethod)
        errMessage = 'Error: Missing persistenceMethod'

    return {
        valid: !errMessage,
        errorMessage: errMessage
    }
}

export const validateUpdateParams = ({ todos, id, newStatus }) => {
    let errMessage = ''
    if (!validateStatus(newStatus, false))
        errMessage = `Error: Invalid status ${newStatus}`

    else if (!id)
        errMessage = `Error: Invalid id`

    else if (!todos.find(todo => todo.rawid === id))
        errMessage = `Error: no such TODO with id ${id}`

    return {
        valid: !errMessage,
        errorMessage: errMessage
    }
}

export const validateLoggerName = (loggers, loggerName) => {
    return loggerName && loggers.find(logger => logger.defaultMeta.name === loggerName)
}

export const validateLoggerLevel = (loggerLevel) => {
    return ['ERROR', 'INFO', 'DEBUG'].includes(loggerLevel)
}