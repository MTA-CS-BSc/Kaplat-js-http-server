import { Router, json } from 'express'
import todoLogger from '../modules/loggers/TodoLogger.js'
import { requestLogger } from '../modules/loggers/RequestLogger.js'
import { validateLoggerName, validateLoggerLevel } from '../modules/validators.js'

const router = Router()
router.use(json())

const loggers = [ requestLogger, todoLogger ]

router.get('/level', (req, res) => {
    const loggerName = req.query['logger-name']
    
    if (validateLoggerName(loggers, loggerName)) {
        const logger = loggers.find(logger => logger.defaultMeta.name == loggerName)
        res.status(200).send(logger.level.toUpperCase())
    }

    else
        res.status(400).send('Invalid logger name')
})

router.put('/level', (req, res) => {
    const loggerName = req.query['logger-name']
    const loggerLevel = req.query['logger-level']

    if (validateLoggerName(loggers, loggerName) && validateLoggerLevel(loggerLevel)) {
        const logger = loggers.find(logger => logger.defaultMeta.name == loggerName)
        logger.level = loggerLevel.toString().toLowerCase()
        res.status(200).send(logger.level.toUpperCase())
    }

    else
        res.status(400).send('Invalid logger name or logger level')
})

export default router