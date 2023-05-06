const exp = require('express')
const TodosCollection = require('../modules/TodosCollection')
const todoSchema = require('./TodoSchema')
const status = require('../modules/status')
const { getNextUserId } = require('../modules/UserIdGenerator')
const { validateStatus, validateTodoSchemaAndDetails, validateContentParams, validateUpdateParams, validateTodoId } = require('../modules/validators')
const { getSortFunction, getStatusString } = require('../modules/helpers')
const { todoLogger } = require('../modules/loggers/TodoLogger')
const { makeLog } = require('../modules/loggers/GenericLoggerModule')

const todos = new TodosCollection()
const router = exp.Router()
router.use(exp.json())

router.get('/health', (req, res) => {
    res.status(200).send('OK')
})

router.post('/', (req, res) => {
    const id = getNextUserId()

    makeLog(todoLogger.info, `Creating new TODO with Title [${req.body.title}]`, req.id)
    makeLog(todoLogger.debug, `Currently there are ${todos.size()} Todos in the system. New TODO will be assigned with id ${id}`, req.id)

    const { error, value } = todoSchema.validate({id: id, status: status.PENDING, ...req.body})

    if (validateTodoSchemaAndDetails({error, value, res, reqId: req.id, todos})) {
        todos.push({...value})
        res.status(200).json({result: id})
    }
})

router.put('/', (req, res) => {
    const id = req.query?.id
    const newStatus = req.query?.status

    makeLog(todoLogger.info, `Update TODO id [${id}] state to ${newStatus}`, req.id)

    const { todo, oldStatusString } = validateUpdateParams({todos, id, newStatus, res, reqId: req.id})
    
    if (todo) {
        makeLog(todoLogger.debug, `Todo id [${id}] state change: ${oldStatusString} --> ${newStatus}`, req.id)
        todo.status = status[newStatus]
    
        res.status(200).json({result: oldStatusString})
    }
})

router.delete('/', (req, res) => {
    const id = req.query?.id

    if (!id)
        res.status(400).send('Invalid id')

    makeLog(todoLogger.info, `Removing todo id ${id}`, req.id)

    const todo = validateTodoId({res, id, todos, reqId: req.id})

    if (todo) {
        todos.remove(parseInt(id))
        makeLog(todoLogger.debug, `After removing todo id [${id}] there are ${todos.size()} TODOs in the system`, req.id)
        
        res.status(200).json({result: todos.size()})
    }
})

router.get('/size', (req, res) => {
    const statusFilter = req.query?.status

    if (!statusFilter || !validateStatus(statusFilter, true))
        res.status(400).send('Status invalid')

    else {
        makeLog(todoLogger.info, `Total TODOs count for state ${statusFilter} is ${todos.size(statusFilter)}`, req.id)
        res.status(200).json({result: todos.size(statusFilter)})    
    }
})

router.get('/content', (req, res) => {
    const filter = req.query?.status
    const sortBy = req.query?.sortBy ? req.query.sortBy : ''

    const errMessage = validateContentParams(filter, sortBy)

    if (!errMessage) {
        makeLog(todoLogger.info, `Extracting todos content. Filter: ${filter} | Sorting by: ${sortBy ? sortBy: 'ID'}`, req.id)
        
        const filtered = [...todos.get(filter)]
        makeLog(todoLogger.debug, `There are a total of ${todos.size()} todos in the system. The result holds ${filtered.length} todos`, req.id)
        
        res.status(200).json({result: filtered.reduce((res, item) => {
            res.push({...item, status: getStatusString(item.status)})
            return res
        }, []).sort(getSortFunction(sortBy))})
    }  
    
    else
        res.status(400).send(errMessage)
})

module.exports = router