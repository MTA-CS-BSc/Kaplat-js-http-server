import { getRequestCount } from "../../modules/RequestsCounter.js"
import { makeLogger } from "./GenericLoggerModule.js"

export const requestLogger = makeLogger(true, 'logging/logs/requests.log', 'info', 'request-logger')

export const makeLogForRequest = (req, res, next) => {
  requestLogger.info(`Incoming request | #${getRequestCount()} | resource: ${req.path} | HTTP Verb ${req.method}`)
    
    const start = Date.now()
    res.on('finish', () => {
      const duration = Date.now() - start
      requestLogger.debug(`request ${getRequestCount()} duration: ${duration}ms`)
    })

    next()
}