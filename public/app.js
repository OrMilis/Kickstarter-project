
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
    document.querySelector('.Body').innerHTML = "<h1>Login Sucssesful!</h1>";
  })
  .catch(error => {
    console.log('Error is', error);
  })
})

const CreateProject = document.querySelector('.CreateProject')
CreateProject.addEventListener('submit', (e) => {
  e.preventDefault()
  const user_name = logedInUser.username;
  const user_id = logedInUser.id;
  const project_name = CreateProject.querySelector('.project_name').value
  const start_date = CreateProject.querySelector('.start_date').value
  const end_date = CreateProject.querySelector('.end_date').value
  const investment = CreateProject.querySelector('.investment').value
  const project_info = CreateProject.querySelector('.project_info').value
  post('/CreateProject', {user_name, user_id, project_name, start_date,end_date, investment, project_info})
  .then(response => {
    if(response.ok)
    return response.text();
  })
  .then(data => {
    data = JSON.parse(data);
    document.querySelector('.Body').innerHTML = data.html;
  })
  .catch(error => {
    console.log('Error is', error);
  })
})

const Invest = document.querySelector('.Invest')
Invest.addEventListener('submit', (e) => {
  e.preventDefault()
  const user_id = logedInUser.id;
  const project_name = Invest.querySelector('.project_name').value
  const investment = Invest.querySelector('.investment').value
  post('/Invest', {user_id, project_name, investment})
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
