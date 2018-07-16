
//var logedInUser = {username, id, premissions}

const CreateUser = document.querySelector('.CreateUser')
CreateUser.addEventListener('submit', (e) => {
  e.preventDefault()
  const username = CreateUser.querySelector('.username').value
  const password = CreateUser.querySelector('.password').value
  post('/createUser', { username, password })
})

const Login = document.querySelector('.Login')
Login.addEventListener('submit', (e) => {
  e.preventDefault()
  const username = Login.querySelector('.username').value
  const password = Login.querySelector('.password').value
  var data = post('/login', { username, password })
    .then((_) => {
      if (status === 401)
        alert('login failed')
      else
        {
          alert('login success ' + ' ' + JSON.stringify(_))
          console.log(_);
          //logedInUser = {username, status.id, status.premissions}
          //console.log(logedInUser);
        }
    })
})

const CreateProject = document.querySelector('.CreateProject')
CreateProject.addEventListener('submit', (e) => {
  e.preventDefault()
  const project_name = CreateProject.querySelector('.project_name').value
  const start_date = CreateProject.querySelector('.start_date').value
  const end_date = CreateProject.querySelector('.end_date').value
  const backers = 0
  const investment = CreateProject.querySelector('.investment').value
  const pledged = 0
  post('/CreateProject', { project_name, start_date,end_date, backers, investment, pledged })
})

function post (path, data) {
  return window.fetch(path, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}
