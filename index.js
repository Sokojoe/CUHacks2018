const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/bye', (req, res) => res.send('Bye World!'))
app.get('/firstcommit', (req, res) => res.send('This is my first commit'))

app.get('/helo', (req, res) => res.send('this is killing me.... help me....'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
