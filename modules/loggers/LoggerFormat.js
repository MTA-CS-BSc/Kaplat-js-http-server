const { format } = require("winston")

const getLoggerFormat = () => {
    return format.combine(
        format.metadata(),
        format.timestamp({
          format: 'DD-MM-YYYY HH:mm:ss.SSS'
        }),
        format.printf(info => `${info.timestamp} ${info.level.toString().toUpperCase()}: ${info.message} | request #${info.metadata.requestId}`)
    )
}

module.exports = {
  getLoggerFormat
}