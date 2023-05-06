const exp = require('express')
const { todoLogger } = require('../modules/loggers/TodoLogger')
const { requestLogger } = require('../modules/loggers/RequestLogger')

const router = exp.Router()
router.use(exp.json())

const loggers = [ requestLogger, todoLogger ]

router.get('/level', (req, res) => {
    const loggerName = req.query['logger-name']

    const foundLogger = loggers.find(logger => logger.defaultMeta.name == loggerName)
    
    if (!loggerName || !foundLogger)
        res.status(400).send('Invalid logger name')

    else
        res.status(200).json({result: foundLogger.level.toUpperCase()})
})

module.exports = router