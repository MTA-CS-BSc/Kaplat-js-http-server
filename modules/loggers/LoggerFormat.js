import { format } from "winston"
const dateFormat = require('dateformat')

export const getLoggerFormat = () => {
    return format.combine(
        format.timestamp({
          format: () => dateFormat(new Date(), "dd-mm-yyyy hh:MM:ss.l"),
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message} | request #${info.meta.requestId}`)
    )
}