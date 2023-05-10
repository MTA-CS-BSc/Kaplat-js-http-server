let requestsCounter = 0

const incrementRequestsCounter = () => {
    requestsCounter++
}

const getRequestCount = () => {
    return requestsCounter
}

module.exports = {
    getRequestCount,
    incrementRequestsCounter
}