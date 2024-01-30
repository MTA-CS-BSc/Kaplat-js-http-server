export const getSortFunction = (sortBy) => {
    if (!sortBy || sortBy === 'ID')
        return (x, y) => x.id - y.id
    
    else if (sortBy === 'DUE_DATE')
        return (x, y) => x.dueDate - y.dueDate
        
    else if (sortBy === 'TITLE')
        return (x, y) => x.title.localeCompare(y.title)
        
}