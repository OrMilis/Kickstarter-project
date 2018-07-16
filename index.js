// JavaScript source code
const express = require('express')
const bodyParser = require('body-parser')
const store = require('./store')

const app = express()

app.use(express.static('public'))
app.use(bodyParser.json())

app.post('/createUser', (req, res) => {
  store
    .createUser({
      username: req.body.username,
      password: req.body.password
    })
    .then(() => res.sendStatus(200))
})

app.post('/login', (req, res) => {
  store.authenticate({
      username: req.body.username,
      password: req.body.password
    })
    .then(({ data }) => {
    	console.log(data)
      if (data['success']) res.send(data)
      else res.sendStatus(401)
    })
})

app.post('/createProject', (req, res) => {
  store.createProject({
      project_name: req.body.project_name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      backers: 0,
      investment: req.body.investment,
      pledged: 0
    })
    .then(() => res.sendStatus(200))
})

app.listen(7555, () => {
  console.log('Server running on http://172.40.0.116:7555')
})
