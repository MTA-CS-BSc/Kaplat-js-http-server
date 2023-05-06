const express = require('express')
const todoRouter = require('./api/TodoRouter')
const { makeLogForRequest } = require('./modules/loggers/RequestLogger')

const PORT = 8496
const app = express()

let requestsCounter = 0

app.use((req, res, next) => {
    req.id = ++requestsCounter
    next()
})

app.use(makeLogForRequest)

app.use('/todo', todoRouter)
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...\n`))