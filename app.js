const express = require('express')
const bodyParser = require('body-parser')
const { getNextUserId } = require('./userIdGenerator')
const { todoSchema } = require('./todoSchema')
const { status } = require('./status')
const { push: addToDo, size: getTodosAmount, get: getTodos, find: findToDo, remove: removeToDo } = require('./todosCollection')
const { validateCreateTodo, validateStatus } = require('./validators')
const { getSortFunction, getStatusString } = require('./helpers')

const PORT = 8496
const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/todo/health', (req, res) => {
    console.log(`GET invoked on /todo/health\n`)
    res.status(200).send('OK')
})

app.post('/todo', (req, res) => {
    const id = getNextUserId()

    const { error, value } = todoSchema.validate({id: id, status: status.PENDING, ...req.body})

    if (error)
        return res.status(400).json({errorMessage: error?.details[0]?.message})

    const errMessage = validateCreateTodo(value)

    if (errMessage)
        return res.status(409).json({errorMessage: errMessage})

    addToDo({...value})
    console.log(`POST invoked, data added: ${JSON.stringify(value)}\n`)

    return res.status(200).json(id)    
})

app.put('/todo', (req, res) => {
    const id = req.query?.id
    const newStatus = req.query?.status

    if (!id)
        return res.status(400).send('Invalid id!\n')

    const todo = findToDo('id', parseInt(id))
    const oldStatusString = getStatusString(todo.status)

    if (!todo)
        return res.status(404).json({errorMessage: `Error: no such TODO with id ${id}\n`})

    if (!validateStatus(newStatus, false))
        return res.status(400)

    todo.status = status[newStatus]

    console.log(`PUT invoked on /todo; Updated todo with id ${id} to status ${oldStatusString}\n`)
    return res.status(200).send(oldStatusString)
})

app.get('/todo/size', (req, res) => {
    const filter = req.query?.status

    if (!filter || !validateStatus(filter, true))
        return res.status(400).send('Status invalid!\n')

    console.log(`GET invoked on /todo/size\n`)
    return res.status(200).json(getTodosAmount(filter))
})

app.get('/todo/content', (req, res) => {
    const filter = req.query?.status
    const sortBy = req.query?.sortBy

    if (!filter || !validateStatus(filter, true))
        return res.status(400).send('Status invalid!\n')

    if (sortBy !== '' && !['DUE_DATE', 'ID', 'TITLE'].find(sortBy))
        return res.status(400).send('Sort by invalid!\n')

    console.log('GET invoked on /todo/content\n')

    return res.status(200).json(getTodos(filter).map(element => {
        element.status = getStatusString(element.status)
        return element
    }).sort(getSortFunction(sortBy)))
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...\n`))