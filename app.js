const express = require('express')
const bodyParser = require('body-parser')
const { getNextUserId } = require('./userIdGenerator')
const { todoSchema } = require('./todoSchema')
const { status } = require('./status')
const { push: addToDo, size: getTodosAmount, get: getTodos } = require('./todosCollection')
const { validateCreateTodo, validateFilter } = require('./validators')

const PORT = 8496
const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/todo/health', (req, res) => {
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
    console.log(`POST invoked, data added: ${JSON.stringify(value)}`)

    return res.status(200).json(id)    
})

app.get('/todo/size', (req, res) => {
    const filter = req.query?.status

    if (!filter || !validateFilter(filter))
        return res.status(400).send('Status invalid!\n')

    return res.status(200).json(getTodosAmount(filter))
})

app.get('/todo/content', (req, res) => {
    const filter = req.query?.status

    if (!filter || !validateFilter(filter))
        return res.status(400).send('Status invalid!\n')
    
    return res.status(200).json(getTodos(filter).map(element => {
        switch (element.status) {
            case status.PENDING:
                element.status = 'PENDING'
                break;
            case status.DONE:
                element.status = 'DONE'
                break;
            case status.LATE:
                element.status = 'LATE'
                break;
        }

        return element
    }))
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`))