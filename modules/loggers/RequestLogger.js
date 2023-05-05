import { createLogger, transports } from "winston"
import { getLoggerFormat } from "./LoggerFormat"

export const requestLogger = createLogger({
    format: getLoggerFormat(),
    transports: [
        new transports.Console(),
        new transports.File({filename: '../../logs/requests.log'})
    ]
})