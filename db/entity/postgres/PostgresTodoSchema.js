export default {
    name: "todos",
    columns: {
        rawid: {
            type: 'int',
            primary: true
        },
        title: {
            type: 'text'
        },
        content: {
            type: 'text'
        },
        state: {
            type: 'text'
        },
        duedate: {
            type: 'bigint'
        }
    }
}