
var logedInUser = {
  username: '',
  id: -1,
  permissions: ''}

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
  post('/login', { username, password })
  .then(response => {
    if(response.ok)
    return response.text();
  })
  .then(data => {
    data = JSON.parse(data);
    logedInUser.username = username;
    logedInUser.id = data.id;
    logedInUser.permissions = data.permissions;
    console.log(data);
    console.log(logedInUser);
  })
  .catch(error => {
    console.log('Error is', error);
  })
})

const CreateProject = document.querySelector('.CreateProject')
CreateProject.addEventListener('submit', (e) => {
  e.preventDefault()
  const id = logedInUser.id;
  const project_name = CreateProject.querySelector('.project_name').value
  const start_date = CreateProject.querySelector('.start_date').value
  const end_date = CreateProject.querySelector('.end_date').value
  const investment = CreateProject.querySelector('.investment').value
  post('/CreateProject', {id, project_name, start_date,end_date, investment})
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

function get (path) {
  return window.fetch(path, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}
