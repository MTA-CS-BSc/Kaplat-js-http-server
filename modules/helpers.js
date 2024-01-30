export function getSortFunction(sortBy) {
    if (!sortBy || sortBy == 'ID')
        return (x, y) => x.id - y.id
    
    else if (sortBy == 'DUE_DATE')
        return (x, y) => x.duedate - y.duedate
        
    else if (sortBy == 'TITLE')
        return (x, y) => x.title - y.title
        
}

export function getStatusString(statusNumber) {
    if (statusNumber == 0)
        return 'PENDING'

    else if (statusNumber == 1)
        return 'LATE'

    else if (statusNumber == 2)
        return 'DONE'

    return ''
}