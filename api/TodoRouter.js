import { Router, json } from 'express'
import TodosCollection from '../modules/TodosCollection.js'
import todoSchema from './TodoSchema.js'
import status from '../modules/status.js'
import { getNextUserId, resetUserId } from '../modules/UserIdGenerator.js'
import { validateStatus, validateTodoSchemaAndDetails, validateContentParams, validateUpdateParams, validateTodoId } from '../modules/validators.js'
import { getSortFunction, getStatusString } from '../modules/helpers.js'
import todoLogger from '../modules/loggers/TodoLogger.js'

const todos = new TodosCollection()
const router = Router()
router.use(json())

router.get('/health', (req, res) => {
    res.status(200).send('OK')
})

router.post('/', (req, res) => {
    const id = getNextUserId()

    const { error, value } = todoSchema.validate({id: id, status: status.PENDING, ...req.body})

    if (validateTodoSchemaAndDetails({error, value, res, todos})) {
        todoLogger.info(`Creating new TODO with Title [${req.body.title}]`)
        todoLogger.debug(`Currently there are ${todos.size()} Todos in the system. New TODO will be assigned with id ${id}`)
    
        todos.push({...value})
        res.status(200).json({result: id})
    }
})

router.put('/', (req, res) => {
    const id = req.query?.id
    const newStatus = req.query?.status

    todoLogger.info(`Update TODO id [${id}] state to ${newStatus}`)

    const { todo, oldStatusString } = validateUpdateParams({todos, id, newStatus, res})
    
    if (todo) {
        todoLogger.debug(`Todo id [${id}] state change: ${oldStatusString} --> ${newStatus}`)
        todo.status = status[newStatus]
    
        res.status(200).json({result: oldStatusString})
    }
})

router.delete('/all', (_, res) => {
    todos.removeAll()
    resetUserId()
    res.status(200).json({ result: "OK" })
})

router.delete('/', (req, res) => {
    const id = req.query?.id

    if (!id)
        res.status(400).send('Invalid id')

    const todo = validateTodoId({res, id, todos})

    if (todo) {
        todoLogger.info(`Removing todo id ${id}`)

        todos.remove(parseInt(id))
        todoLogger.debug(`After removing todo id [${id}] there are ${todos.size()} TODOs in the system`)
        
        res.status(200).json({result: todos.size()})
    }
})

router.get('/size', (req, res) => {
    const statusFilter = req.query?.status

    if (!statusFilter || !validateStatus(statusFilter, true))
        res.status(400).send('Status invalid')

    else {
        todoLogger.info(`Total TODOs count for state ${statusFilter} is ${todos.size(statusFilter)}`)
        res.status(200).json({result: todos.size(statusFilter)})    
    }
})

router.get('/content', (req, res) => {
    const filter = req.query?.status
    const sortBy = req.query?.sortBy ? req.query.sortBy : ''

    const errMessage = validateContentParams(filter, sortBy)

    if (!errMessage) {
        todoLogger.info(`Extracting todos content. Filter: ${filter} | Sorting by: ${sortBy ? sortBy: 'ID'}`)
        
        const filtered = [...todos.get(filter)]
        todoLogger.debug(`There are a total of ${todos.size()} todos in the system. The result holds ${filtered.length} todos`)
        
        res.status(200).json({result: filtered.reduce((res, item) => {
            res.push({...item, status: getStatusString(item.status)})
            return res
        }, []).sort(getSortFunction(sortBy))})
    }  
    
    else
        res.status(400).send(errMessage)
})

export default router