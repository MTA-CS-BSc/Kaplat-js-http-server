import { decreaseId } from '../modules/IdGenerator.js'
import todoLogger from '../logging/loggers/TodoLogger.js'
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

export const validateCreateTodo = (props) => {
    const { error, value, todos } = props
    const errMessage = error ? `Error: ${error.details[0]?.message}` : validateTodoDetails(todos, value)

    if (!!errMessage) {
        todoLogger.error(errMessage)
        decreaseId()
        return errMessage
    }

    return ''
}

export const validateContentParams = (filter, sortBy, persistenceMethod) => {
    if (!filter || !validateStatus(filter, true))
        return 'Error: Invalid status'
        
    if (sortBy !== '' && !(['DUE_DATE', 'ID', 'TITLE'].includes(sortBy)))
        return 'Error: Invalid sort by'

    if (!persistenceMethod)
        return 'Error: Missing persistenceMethod'

    return ''
}

export const validateUpdateParams = (props) => {
    const { todos, id, newStatus } = props

    if (!validateStatus(newStatus, false))
        return `Error: Invalid status ${newStatus}`

    else if (!id)
        return `Error: Invalid id`

    else if (!todos.find(todo => todo.rawid === id))
        return `Error: no such TODO with id ${id}`

    return ''

}

export const validateLoggerName = (loggers, loggerName) => {
    return loggerName && loggers.find(logger => logger.defaultMeta.name == loggerName)
}

export const validateLoggerLevel = (loggerLevel) => {
    return ['ERROR', 'INFO', 'DEBUG'].includes(loggerLevel)
}