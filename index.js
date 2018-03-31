const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/helo', (req, res) => res.send('this is killing me.... help me....'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
