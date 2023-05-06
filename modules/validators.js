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

const validateTodoSchemaAndDetails = (error, value, res, reqId, todos) => {
    if (error) { // Error and value received from schema
        makeLog(todoLogger.error, `Error: ${error?.details[0]?.message}`, reqId)

        decrementUserId()
        res.status(400).json({errorMessage: error?.details[0]?.message})
        return false
    }

    else {
        const errMessage = validateCreateTodo(todos, value)

        if (errMessage) {
            makeLog(todoLogger.error, errMessage, reqId)
    
            decrementUserId()
            res.status(409).json({errorMessage: errMessage})
            return false
        }
    }

    return true
}

const validateContentParams = (filter, sortBy, res) => {
    if (!filter || !validateStatus(filter, true)) {
        res.status(400).send('Invalid status')
        return false
    }
        
    if (sortBy !== '' && !(['DUE_DATE', 'ID', 'TITLE'].includes(sortBy))) {
        res.status(400).send('Invalid sort by')
        return false
    }    

    return true    
}

const validateUpdateParams = (todos, id, newStatus, res, reqId) => {
    if (!id) {
        res.status(400).send('Invalid id')
        return { todo: null, oldStatusString: '' }
    }

    const todo = validateTodoId(res, id, todos, reqId)
    const oldStatusString = getStatusString(todo?.status)
    
    if (todo) {
        if (!validateStatus(newStatus, false)) {
            res.status(400).send('Invalid status')
            return { todo: null, oldStatusString: '' }
        }        
    
        return { todo, oldStatusString }   
    }

    return { todo: null, oldStatusString: ''}

}

const validateTodoId = (res, id, todos, reqId) => {
    const todo = todos.find('id', parseInt(id))
    
    if (!todo) {
        makeLog(todoLogger.error, `Error: no such TODO with id ${id}`, reqId)
        res.status(404).json({errorMessage: `Error: no such TODO with id ${id}`}) 
        return null
    }
    
    return todo
}

const validateLoggerName = (loggers, loggerName) => {
    const foundLogger = loggers.find(logger => logger.defaultMeta.name == loggerName)

    if (!loggerName || foundLogger)
        return false

    return true
}

module.exports = {
    validateStatus,
    validateTodoSchemaAndDetails,
    validateContentParams,
    validateUpdateParams,
    validateTodoId,
    validateLoggerName
}