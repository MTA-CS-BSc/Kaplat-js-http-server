const express = require('express')
const todoRouter = require('./api/TodoRouter')

const PORT = 8496
const app = express()

app.use('/todo', todoRouter)

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...\n`))