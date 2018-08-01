// JavaScript source code
const express = require('express')
const bodyParser = require('body-parser')
const store = require('./store')

const app = express()

app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/homepage', (req, res) => {
  store
    .getHomePage()
    .then(site => {
      res.send(site);
    })
})

app.get('/logInPage', (req, res) => {
  store
    .getLoginPage()
    .then(site => {
      res.send(site);
    })
})

app.get('/signUpPage', (req, res) => {
  store
    .getSignUpPage()
    .then(site => {
      res.send(site);
    })
})

/*
app.get('/profilePage', (req,res) => {
  store.getProfilePage()
  .then(site => {
    res.send(site)
  })
})
*/

app.get('/adminPage', (req, res) => {
  store
    .getAdminPage()
    .then((adminPage) => {
      return res.send(adminPage)
    })
})

app.post('/getUpdatePage', (req, res) => {
  var user_name = req.body.user_name
  var project_name = req
    .body
    .project_name
    store
    .getUpdatePage({user_name, project_name})
    .then((updatePage) => {
      return res.send(updatePage)
    })
})

app.post('/profilePage', (req, res) => {
  var user = req.body.logedInUser
  //console.log("index log in user: ");
  //console.log(user);
  store
    .getProfilePage(user)
    .then((backerPage) => {
      return res.send(backerPage)
    })
})

app.put('/updatePermission', (req, res) => {
  var user = req.body.logedInUser;
  store
    .updatePermission(user)
    .then(() => {
      res.sendStatus(200)
    })
})

app.get('/creatorPage', (req, res) => {
  store
    .getCreatorPage()
    .then((creatorPage) => {
      return res.send(creatorPage)
    })
})

app.post('/createUser', (req, res) => {
  store
    .createUser({username: req.body.username, password: req.body.password})
    .then(() => res.sendStatus(200))
})

app.post('/login', (req, res) => {
  store
    .authenticate({username: req.body.username, password: req.body.password})
    .then((data) => {
      if (data.success) {
        return res.send(data)
      } else
        res.sendStatus(401)
    })
})

app.post('/createProject', (req, res) => {
  store
    .createProject(req.body)
    .then(site => {
      return res.send(site);
    })
})

app.post('/Invest', (req, res) => {
  store
    .Invest({user_id: req.body.user_id, project_name: req.body.project_name, investment: req.body.investment})
    .then(() => res.sendStatus(200))
})

//TODO: updateProject
app.post('/updateProject', (req, res) => {
  store
    .updateProject(req.body)
    .then((site) => {
      res.send(site)
    })
})

//TODO: findAllProjects
//app.get('/findAllProjects', (req, res) => {
//  store.findAllProjects()
//  .then(() => res.sendStatus(200))
//})

app.get('/findAllProjects', (req, res) => {
  store
    .findAllProjects()
    .then((projects) => {
      if (projects) {
        //console.log("IN INDEX: "+projects);
        res.send(projects)
      } else {
        res.sendStatus(401)
      }
    })
})

//TODO: removeProject
app.delete('/removeProject', (req, res) => {
  store
    .removeProject({id: req.body.id})
    .then(() => {
      return res.sendStatus(200);
    })
})

//TODO: remove users
app.delete('/removeUser', (req, res) => {
  console.log(req.body.user_id);
  store
    .removeUser({user_id: req.body.user_id})
    .then(() => {
      return res.sendStatus(200);
    })
})

//TODO: getProjectSite
app.post('/project', (req, res) => {
  store
    .retrieveProjectSite({user_name: req.body.user_name, project_name: req.body.project_name})
    .then(data => {
      return res.send(data);
    })
})

app.listen(7555, () => {
  console.log('Server running on http://172.40.0.116:7555')
})
