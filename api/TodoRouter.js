const exp = require('express')
const TodosCollection = require('../modules/TodosCollection')
const todoSchema = require('./TodoSchema')
const status = require('../modules/status')
const { getNextUserId } = require('../modules/UserIdGenerator')
const { validateStatus, validateTodoSchemaAndDetails, validateContentParams } = require('../modules/validators')
const { getSortFunction, getStatusString, todoValid } = require('../modules/helpers')
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

    if (validateTodoSchemaAndDetails(error, value, res)) {
        todos.push({...value})
        res.status(200).json({result: id})
    }
})

router.put('/', (req, res) => {
    const id = req.query?.id
    const newStatus = req.query?.status

    // “Update TODO id [{todo ID}] state to {requested state}”
    if (!id)
        res.status(400).send('Invalid id')

    const todo = todos.find('id', parseInt(id))
    const oldStatusString = getStatusString(todo?.status)

    if (!todo)
        res.status(404).json({errorMessage: `Error: no such TODO with id ${id}`})

    if (!validateStatus(newStatus, false))
        res.status(400).send('Invalid status')

    todo.status = status[newStatus]

    res.status(200).json({result: oldStatusString})
})

router.delete('/', (req, res) => {
    const id = req.query?.id

    if (!id)
        res.status(400).send('Invalid id')

    const todo = todos.find('id', parseInt(id))

    if (!todo)
        res.status(404).json({errorMessage: `Error: no such TODO with id ${id}`}) 

    todos.remove(parseInt(id))

    res.status(200).json({result: todos.size()})
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

    if (validateContentParams(filter, sortBy, res)) {
        makeLog(todoLogger.info, `Extracting todos content. Filter: ${filter} | Sorting by: ${sortBy ? sortBy: 'ID'}`, req.id)
        
        const filtered = [...todos.get(filter)]
        makeLog(todoLogger.debug, `There are a total of ${todos.size()} todos in the system. The result holds ${filtered.size()} todos`, req.id)
        
        res.status(200).json({result: filtered.reduce((res, item) => {
            res.push({...item, status: getStatusString(item.status)})
            return res
        }, []).sort(getSortFunction(sortBy))})
    }    
})

module.exports = router