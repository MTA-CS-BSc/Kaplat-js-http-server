import { decreaseId } from '../modules/IdGenerator.js'
import { getStatusString } from '../modules/helpers.js'
import todoLogger from '../logging/loggers/TodoLogger.js'
import status from '../dicts/status.js'

export const validateTitle = (todos, title) => {
    return !todos.some(todo => todo.title === title)
}

export const validateDueDate = (dueDate) => {
    return new Date(dueDate) > Date.now()
}

export const validateCreateTodo = (todos, todo) => {
    let errorMessage = ''

    if (!validateTitle(todos, todo.title))
        errorMessage = `Error: TODO with the title ${todo.title} already exists in the system`

    else if (!validateDueDate(todo.duedate))
        errorMessage = `Error: Can’t create new TODO that its due date is in the past`

    return errorMessage
}

export const validateStatus = (statusFilter, withAllKey = false) => {
    return withAllKey ? Object.keys(status).includes(statusFilter)
            : Object.keys(status).filter(element => element !== 'ALL').includes(statusFilter)
}

export const validateTodoSchemaAndDetails = (props) => {
    const { error, value, todos } = props
    const errMessage = error ? 'Error: ' + error.details[0]?.message : validateCreateTodo(todos, value)

    if (errMessage) {
        todoLogger.error(errMessage)
        decreaseId()
        return errMessage
    }

    return ''
}

export const validateContentParams = (filter, sortBy, persistenceMethod) => {
    if (!filter || !validateStatus(filter, true))
        return 'Invalid status'
        
    if (sortBy !== '' && !(['DUE_DATE', 'ID', 'TITLE'].includes(sortBy)))
        return 'Invalid sort by'

    if (!persistenceMethod)
        return 'Missing persistenceMethod'

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