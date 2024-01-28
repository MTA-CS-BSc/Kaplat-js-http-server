import { decrementUserId } from './UserIdGenerator.js'
import { getStatusString } from './helpers.js'
import todoLogger from './loggers/TodoLogger.js'
import status from './status.js'

export function validateTitle(todos, title) {
    return (!todos.find('title', title))
}

export function validateDueDate(dueDate) {
    return new Date(dueDate) > Date.now()
}

export function validateCreateTodo(todos, todo) {
    let errorMessage = ''

    if (!validateTitle(todos, todo.title))
        errorMessage = `Error: TODO with the title ${todo.title} already exists in the system`

    else if (!validateDueDate(todo.dueDate))
        errorMessage = `Error: Can’t create new TODO that its due date is in the past`

    return errorMessage
}

export function validateStatus(statusFilter, withAllKey = false) {
    return withAllKey ? Object.keys(status).includes(statusFilter)
            : Object.keys(status).filter(element => element !== 'ALL').includes(statusFilter)
}

export const validateTodoSchemaAndDetails = (props) => {
    const { error, value, res, todos } = props
    const errMessage = error ? error.details[0]?.message : validateCreateTodo(todos, value)

    if (errMessage) {
        todoLogger.error(errMessage)

        decrementUserId()
        res.status(409).json({errorMessage: errMessage})
        return false
    }

    return true
}

export const validateContentParams = (filter, sortBy) => {
    if (!filter || !validateStatus(filter, true))
        return 'Invalid status'
        
    if (sortBy !== '' && !(['DUE_DATE', 'ID', 'TITLE'].includes(sortBy)))
        return 'Invalid sort by'

    return ''
}

export const validateUpdateParams = (props) => {
    const { todos, id, newStatus, res } = props
    const errData = { todo: null, oldStatusString: '' }

    if (!id) {
        res.status(400).send('Invalid id')
        return errData
    }

    const todo = validateTodoId({res, id, todos})
    const oldStatusString = getStatusString(todo?.status)
    
    if (todo) {
        if (!validateStatus(newStatus, false)) {
            res.status(400).send('Invalid status')
            return errData
        }        
    
        return { todo, oldStatusString }   
    }

    return errData

}

export const validateTodoId = (props) => {
    const { res, id, todos } = props
    const todo = todos.find('id', parseInt(id))
    
    if (!todo) {
        const errMessage = `Error: no such TODO with id ${id}`
        todoLogger.error(errMessage)
        res.status(404).json({errorMessage: errMessage}) 
        return null
    }
    
    return todo
}

export const validateLoggerName = (loggers, loggerName) => {
    return loggerName && loggers.find(logger => logger.defaultMeta.name == loggerName)
}

export const validateLoggerLevel = (loggerLevel) => {
    return ['ERROR', 'INFO', 'DEBUG'].includes(loggerLevel)
}