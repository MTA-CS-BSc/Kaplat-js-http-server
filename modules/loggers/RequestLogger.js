const { getRequestCount } = require("../RequestsCounter")
const { makeLogger } = require("./GenericLoggerModule")

const requestLogger = makeLogger(true, 'logs/requests.log', 'info', 'request-logger')

const makeLogForRequest = (req, res, next) => {
  requestLogger.info(`Incoming request | #${getRequestCount()} | resource: ${req.path} | HTTP Verb ${req.method}`)
    
    const start = Date.now()
    res.on('finish', () => {
      const duration = Date.now() - start
      requestLogger.debug(`request ${getRequestCount()} duration: ${duration}ms`)
    })

    next()
}

module.exports = {
    makeLogForRequest,
    requestLogger
}