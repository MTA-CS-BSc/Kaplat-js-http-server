const { makeLog, makeLogger } = require("./GenericLoggerModule")

const requestLogger = makeLogger(true, 'logs/requests.log', 'info', 'request-logger')

const makeLogForRequest = (req, res, next) => {
  makeLog(requestLogger.info, `Incoming request | #${req.id} | resource: ${req.path} | HTTP Verb ${req.method}`, req.id)
    
    const start = Date.now()
    res.on('finish', () => {
      const duration = Date.now() - start
      makeLog(requestLogger.debug, `request ${req.id} duration: ${duration}ms`, req.id)
    })

    next()
}

module.exports = {
    makeLogForRequest
}