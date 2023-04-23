const exp = require('express')
const TodosCollection = require('../modules/TodosCollection')
const todoSchema = require('./TodoSchema')
const status = require('../modules/status')
const { getNextUserId, decrementUserId } = require('../modules/UserIdGenerator')
const { validateCreateTodo, validateStatus } = require('../modules/validators')
const { getSortFunction, getStatusString } = require('../modules/helpers')

const todos = new TodosCollection()
const router = exp.Router()
router.use(exp.json())

router.get('/health', (req, res) => {
    console.log(`GET invoked on /todo/health\n`)
    res.status(200).send('OK')
})

router.post('/', (req, res) => {
    const id = getNextUserId()

    const { error, value } = todoSchema.validate({id: id, status: status.PENDING, ...req.body})

    if (error) {
        decrementUserId()
        res.status(400).json({errorMessage: error?.details[0]?.message})
    }

    const errMessage = validateCreateTodo(todos, value)

    if (errMessage) {
        decrementUserId()
        res.status(409).json({errorMessage: errMessage})
    }

    todos.push({...value})
    console.log(`POST invoked, data added: ${JSON.stringify(value)}\n`)

    res.status(200).send(id.toString())
})

router.put('/', (req, res) => {
    const id = req.query?.id
    const newStatus = req.query?.status

    if (!id)
        res.status(400).send('Invalid id')

    const todo = todos.find('id', parseInt(id))
    const oldStatusString = getStatusString(todo?.status)

    if (!todo)
        res.status(404).json({errorMessage: `Error: no such TODO with id ${id}`})

    if (!validateStatus(newStatus, false))
        res.status(400).send('Invalid status')

    todo.status = status[newStatus]

    console.log(`PUT invoked on /todo; Updated todo with id ${id} to status ${newStatus}\n`)
    res.status(200).send(oldStatusString)
})

router.delete('/', (req, res) => {
    const id = req.query?.id

    if (!id)
        res.status(400).send('Invalid id')

    const todo = todos.find('id', parseInt(id))

    if (!todo)
        res.status(404).json({errorMessage: `Error: no such TODO with id ${id}`}) 

    todos.remove(parseInt(id))

    console.log(`DELETE invoked on /todo; Deleted todo with id ${id}`)
    res.status(200).send(todos.size().toString())
})

router.get('/size', (req, res) => {
    const statusFilter = req.query?.status

    if (!statusFilter || !validateStatus(statusFilter, true))
        res.status(400).send('Status invalid')

    console.log(`GET invoked on /todo/size\n`)
    res.status(200).send(todos.size(statusFilter).toString())
})

router.get('/content', (req, res) => {
    const filter = req.query?.status
    const sortBy = req.query?.sortBy ? req.query.sortBy : ''

    if (!filter || !validateStatus(filter, true))
        res.status(400).send('Status invalid!\n')

    if (sortBy !== '' && !(['DUE_DATE', 'ID', 'TITLE'].includes(sortBy)))    
        res.status(400).send('Sort by invalid!\n')

    console.log('GET invoked on /todo/content\n')

    const filtered = [...todos.get(filter)]
    
    res.status(200).json(filtered.reduce((res, item) => {
        res.push({...item, status: getStatusString(item.status)})
        return res
    }, []).sort(getSortFunction(sortBy)))
})

module.exports = router