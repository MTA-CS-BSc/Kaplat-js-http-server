const { format, createLogger, transports } = require("winston")

const getLoggerFormat = () => {
    return format.combine(
        format.metadata(),
        format.timestamp({
          format: 'DD-MM-YYYY HH:mm:ss.SSS'
        }),
        format.printf(info => `${info.timestamp} ${info.level.toString().toUpperCase()}: ${info.message} | request #${info.metadata.requestId}`)
    )
}

const makeLog = (callback, data, reqId) => {
  callback(data, { requestId: reqId })
}

const createTransportsArray = (isConsole = true, fileName = '') => {
  const transportsArray = []

  if (isConsole)
    transportsArray.push(new transports.Console())

  if (fileName)
    transportsArray.push(new transports.File({filename: fileName}))

  return transportsArray
}

const makeLogger = (isConsole = true, fileName = '', defaultLevel = 'info', loggerName = '') => {
    return createLogger({
      level: defaultLevel,
      defaultMeta: { name: loggerName },
      format: getLoggerFormat(),
      transports: [...createTransportsArray(isConsole, fileName)]})
}

module.exports = {
  getLoggerFormat,
  makeLog,
  makeLogger
}