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
    .then((data) => {
      if (data.success){
        return res.send(data)
      }
      else res.sendStatus(401)
    })
})

app.post('/createProject', (req, res) => {
  store.createProject({
      user_name: req.body.user_name,
      user_id: req.body.user_id,
      project_name: req.body.project_name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      backers: 0,
      investment: req.body.investment,
      pledged: 0,
      project_info: req.body.project_info
    })
    .then((site) => {
      console.log("IN INDEX.JS  " + site);
    })
})

app.post('/Invest', (req, res) => {
  //console.log(req.body.user_id,req.body.project_name,req.body.investment  );
  store.Invest({
      user_id: req.body.user_id,
      project_name: req.body.project_name,
      investment: req.body.investment
    })
    .then(() => res.sendStatus(200))
})

//TODO: findAllProjects

//TODO: findAllUsers

//TODO: removeProject

//TODO: updateProject

//TODO: getProjectSite

app.listen(7555, () => {
  console.log('Server running on http://172.40.0.116:7555')
})
