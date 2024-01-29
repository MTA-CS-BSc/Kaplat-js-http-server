export default {
  name: "todos",
  columns: {
    _id: {
      type: 'ObjectId',
      primary: true
    },
    rawid: {
      type: 'integer'
    },
    title: {
      type: 'string'
    },
    content: {
      type: 'string'
    },
    state: {
      type: 'string'
    },
    duedate: {
      type: 'double'
    }
  }
}