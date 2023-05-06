const { createLogger, transports } = require("winston")
const { getLoggerFormat } = require("./LoggerFormat")

const requestLogger = createLogger({
    format: getLoggerFormat(),
    transports: [
        new transports.Console(),
        new transports.File({filename: 'logs/requests.log'})
    ]
})

const requestLog = (req, res, next) => {
    requestLogger.info(`Incoming request | #${req.id} | resource: ${req.path} | HTTP ${req.method}`, {requestId: req.id})
    
    const start = Date.now()
    res.on('finish', () => {
      const duration = Date.now() - start
      requestLogger.debug(`request ${req.id} duration: ${duration}ms`, { requestId: req.id })
    })

    next()
}

module.exports = {
    requestLog
}