import { format, createLogger, transports } from "winston"
import { getRequestCount } from "../../modules/RequestsCounter.js"

export const getLoggerFormat = () => {
    return format.combine(
        format.metadata(),
        format.timestamp({
          format: 'DD-MM-YYYY HH:mm:ss.SSS'
        }),
        format.printf(info => `${info.timestamp} ${info.level.toString().toUpperCase()}: ${info.message} | request #${getRequestCount()}`)
    )
}

const createTransportsArray = (isConsole = true, fileName = '') => {
  const transportsArray = []

  if (isConsole)
    transportsArray.push(new transports.Console())

  if (fileName)
    transportsArray.push(new transports.File({filename: fileName, options: { flags: 'w' } }))

  return transportsArray
}

export const makeLogger = (isConsole = true, fileName = '', defaultLevel = 'info', loggerName = '') => {
    return createLogger({
      level: defaultLevel,
      defaultMeta: { name: loggerName },
      format: getLoggerFormat(),
      transports: [...createTransportsArray(isConsole, fileName)]})
}