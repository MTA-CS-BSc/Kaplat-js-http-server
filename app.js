const express = require('express')
const todoRouter = require('./api/TodoRouter')
const logsRouter = require('./api/LogsRouter')
const { makeLogForRequest } = require('./modules/loggers/RequestLogger')
const { incrementRequestsCounter } = require('./modules/RequestsCounter')

const PORT = 9583
const app = express()

app.use((req, res, next) => {
    incrementRequestsCounter()
    next()
})

app.use(makeLogForRequest)
app.use('/todo', todoRouter)
app.use('/logs', logsRouter)

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...\n`))