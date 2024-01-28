import { Schema } from 'jugglingdb'

export default Schema.define('Todo', {
    rawid: { type: String, length: 255 },
    title: { type: String, length: 255 },
    content: { type: String, length: 511 },
    duedate: { type: Number },
    state: { type: String, maxLength: 8 }
});