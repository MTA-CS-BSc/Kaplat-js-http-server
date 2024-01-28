let requestsCounter = 0

export const incrementRequestsCounter = () => {
    requestsCounter++
}

export const getRequestCount = () => {
    return requestsCounter
}