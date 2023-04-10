const express = require('express')
const bodyParser = require('body-parser')
const todoRouter = require('./api/todoRouter')

const PORT = 8496
const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/todo', todoRouter)

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...\n`))