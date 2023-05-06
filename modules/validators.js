const { decrementUserId } = require('./UserIdGenerator')
const { getStatusString } = require('./helpers')
const { makeLog } = require('./loggers/GenericLoggerModule')
const { todoLogger } = require('./loggers/TodoLogger')
const status = require('./status')

function validateTitle(todos, title) {
    return (!todos.find('title', title))
}

function validateDueDate(dueDate) {
    return new Date(dueDate) > Date.now()
}

function validateCreateTodo(todos, todo) {
    let errorMessage = ''

    if (!validateTitle(todos, todo.title))
        errorMessage = `Error: TODO with the title ${todo.title} already exists in the system`

    else if (!validateDueDate(todo.dueDate))
        errorMessage = `Error: Can’t create new TODO that its due date is in the past`

    return errorMessage
}

function validateStatus(statusFilter, withAllKey = false) {
    return withAllKey ? Object.keys(status).includes(statusFilter)
            : Object.keys(status).filter(element => element !== 'ALL').includes(statusFilter)
}

const validateTodoSchemaAndDetails = (props) => {
    const { error, value, res, reqId, todos } = props
    const errMessage = error ? error.details[0]?.message : validateCreateTodo(todos, value)

    if (errMessage) {
        makeLog(todoLogger.error, errMessage, reqId)

        decrementUserId()
        res.status(409).json({errorMessage: errMessage})
        return false
    }

    return true
}

const validateContentParams = (filter, sortBy) => {
    if (!filter || !validateStatus(filter, true))
        return 'Invalid status'
        
    if (sortBy !== '' && !(['DUE_DATE', 'ID', 'TITLE'].includes(sortBy)))
        return 'Invalid sort by'

    return ''
}

const validateUpdateParams = (props) => {
    const { todos, id, newStatus, res, reqId } = props
    const errData = { todo: null, oldStatusString: '' }

    if (!id) {
        res.status(400).send('Invalid id')
        return errData
    }

    const todo = validateTodoId({res, id, todos, reqId})
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

const validateTodoId = (props) => {
    const { res, id, todos, reqId } = props
    const todo = todos.find('id', parseInt(id))
    
    if (!todo) {
        const errMessage = `Error: no such TODO with id ${id}`
        makeLog(todoLogger.error, errMessage, reqId)
        res.status(404).json({errorMessage: errMessage}) 
        return null
    }
    
    return todo
}

const validateLoggerName = (loggers, loggerName) => {
    return loggerName && loggers.find(logger => logger.defaultMeta.name == loggerName)
}

const validateLoggerLevel = (loggerLevel) => {
    return ['ERROR', 'INFO', 'DEBUG'].includes(loggerLevel)
}

module.exports = {
    validateStatus,
    validateTodoSchemaAndDetails,
    validateContentParams,
    validateUpdateParams,
    validateTodoId,
    validateLoggerName,
    validateLoggerLevel
}