const exp = require('express')
const { todoLogger } = require('../modules/loggers/TodoLogger')
const { requestLogger } = require('../modules/loggers/RequestLogger')
const { validateLoggerName } = require('../modules/validators')

const router = exp.Router()
router.use(exp.json())

const loggers = [ requestLogger, todoLogger ]

router.get('/level', (req, res) => {
    const loggerName = req.query['logger-name']
    
    if (validateLoggerName(loggers, loggerName))
        res.status(200).json({result: foundLogger.level.toUpperCase()})

    else
        res.status(400).send('Invalid logger name')
})

router.put('/level', (req, res) => {

})

module.exports = router