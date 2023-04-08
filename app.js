const express = require('express')
const bodyParser = require('body-parser')
const { getNextUserId } = require('./userIdGenerator')
const { todoSchema } = require('./todoSchema')
const { status } = require('./status')
const { push: addToDo } = require('./todosCollection')
const { validateCreateTodo } = require('./validators')

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
        return res.status(400).json({err: error?.details[0]?.message})

    const errMessage = validateCreateTodo(value)

    if (errMessage)
        return res.status(409).json({errorMessage: errMessage})

    addToDo({...value})
    console.log(`POST invoked, data added: ${JSON.stringify(value)}`)
    
    return res.status(200).json({id: id})    
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`))