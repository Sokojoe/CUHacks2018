const express = require('express')
const app = express()
const axios = require('axios')

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/bye', (req, res) => res.send('Bye World!'))
app.get('/firstcommit', (req, res) => res.send('This is my first commit'))

app.get('/helo', (req, res) => res.send('this is killing me.... help me....'))

var servercode = () => {
  console.log('Server started on port 3000!')
  axios.get('https://hackathon.sipseller.net/central/rest/me', {
      headers: {
        'Authorization': "Basic dGVhbTFAbWFydGVsbG90ZWNoLmNvbTpwaW5lYXBwbGU="
      }
    })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

app.listen(3000, servercode)
