import { config } from './api/config.js'
import express from 'express'
import todoRouter from './api/TodoRouter.js'
import logsRouter from './api/LogsRouter.js'
import { makeLogForRequest } from './logging/loggers/RequestLogger.js';
import { incrementRequestsCounter } from './modules/RequestsCounter.js';

const app = express()

app.use((req, res, next) => {
    incrementRequestsCounter()
    next()
})

app.use(makeLogForRequest)
app.use('/todo', todoRouter)
app.use('/logs', logsRouter)

app.listen(config.PORT, config.HOST, () => console.log(`Server is listening on port ${config.PORT}...\n`))

export default app