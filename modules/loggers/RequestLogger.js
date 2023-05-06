const { createLog, makeLogger } = require("./GenericLoggerModule")

const requestLogger = makeLogger(true, 'logs/requests.log', 'info', 'request-logger')

const makeLogForRequest = (req, res, next) => {
    createLog(requestLogger.info, `Incoming request | #${req.id} | resource: ${req.path} | HTTP Verb ${req.method}`, req.id)
    
    const start = Date.now()
    res.on('finish', () => {
      const duration = Date.now() - start
      createLog(requestLogger.debug, `request ${req.id} duration: ${duration}ms`, req.id)
    })

    next()
}

module.exports = {
    makeLogForRequest
}