const express = require('express')

const PORT = 8496
const app = express()

app.get('/todo/health', (req, res) => {
    res.status(200).send('OK')
})
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`))