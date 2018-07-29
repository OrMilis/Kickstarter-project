var logedInUser = {
  username: '',
  id: -1,
  permissions: ''
}

const CreateUser = document.querySelector('.CreateUser')
CreateUser.addEventListener('submit', (e) => {
  e.preventDefault()
  const username = CreateUser
    .querySelector('.username')
    .value
  const password = CreateUser
    .querySelector('.password')
    .value
  post('/createUser', {username, password})
})

const Login = document.querySelector('.Login')
Login.addEventListener('submit', (e) => {
  e.preventDefault()
  const username = Login
    .querySelector('.username')
    .value
  const password = Login
    .querySelector('.password')
    .value
    post('/login', {username, password})
    .then(response => {
      if (response.ok)
        return response.text();
      }
    )
    .then(data => {
      data = JSON.parse(data);
      logedInUser.username = username;
      logedInUser.id = data.id;
      logedInUser.permissions = data.permissions;
      if (data.permissions == 'ADMIN') {
        getAdminPage();
      } else {
        document
          .querySelector('.adminPage')
          .innerHTML = "<h1>Login Sucssesful!</h1>";
      }
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
  const user_name = logedInUser.username;
  const user_id = logedInUser.id;
  const project_name = CreateProject
    .querySelector('.project_name')
    .value
  const start_date = CreateProject
    .querySelector('.start_date')
    .value
  const end_date = CreateProject
    .querySelector('.end_date')
    .value
  const investment = CreateProject
    .querySelector('.investment')
    .value
  const project_info = CreateProject
    .querySelector('.project_info')
    .value
  const project_video = CreateProject
    .querySelector('.project_video')
    .value
  const project_image = CreateProject
    .querySelector('.project_image')
    .value
    post('/CreateProject', {
      user_name,
      user_id,
      project_name,
      start_date,
      end_date,
      investment,
      project_info,
      project_video,
      project_image
    })
    .then(response => {
      if (response.ok)
        return response.text();
      }
    )
    .then(data => {
      console.log(data);
      document
        .querySelector('.Body')
        .innerHTML = data;
    })
    .catch(error => {
      console.log('Error is', error);
    })
  })

const Invest = document.querySelector('.Invest')
Invest.addEventListener('submit', (e) => {
  e.preventDefault()
  const user_id = logedInUser.id;
  const project_name = Invest
    .querySelector('.project_name')
    .value
  const investment = Invest
    .querySelector('.investment')
    .value
  post('/Invest', {user_id, project_name, investment})
})

const Project = document.querySelector('.GetProject')
Project.addEventListener('submit', (e) => {
  e.preventDefault()
  const user_name = Project
    .querySelector('.username')
    .value
  const project_name = Project
    .querySelector('.project_name')
    .value
    console
    .log('name: ' + user_name + ' pro: ' + project_name);
  post('/project', {user_name, project_name})
    .then(response => {
      if (response.ok)
        return response.text();
      }
    )
    .then(data => {
      console.log(data);
      document
        .querySelector('.Body')
        .innerHTML = data;
      var Pledged = document.querySelector('.Pledge');
      Pledged.addEventListener('submit', (e) => {
        e.preventDefault()
        if (logedInUser.id != -1) {
          const investment = document
            .querySelector('.amount')
            .value;
          const user_id = logedInUser.id;
          console.log({user_id, project_name, investment});
          post('/Invest', {user_id, project_name, investment})
        }
      })
    })
    .catch(error => {
      console.log('Error is', error);
    })
  })

/*const find = document.querySelector('.TestFind')
find.addEventListener('submit', (e) => {
    e.preventDefault()

});

function buildList(path,elementId,property) {
    var list;
    get(path)
    .then(response => {
      if(response.ok)
        return response.text()
        .then(data => {
          data = JSON.parse(data);
          //console.log(data);
          list = data
          var ul = document.getElementById(elementId);
          for(var i=0; i<list.length; i++){
            //console.log(list[i]);
            var li = document.createElement("li");
            li.setAttribute('id',i)
            li.appendChild(document.createTextNode(list[i][property]));
            ul.appendChild(li);
            }
        })
    })
  }
*/
function buildSelect(path, selectElement, property) {
  var list;
  get(path) //"/findAllUsers"
    .then(response => {
    if (response.ok)
      return response
        .text()
        .then(data => {
          data = JSON.parse(data);
          //console.log(data);
          list = data
          var select = document.getElementById(selectElement); //"selUsers"
          for (var i = 0; i < list.length; i++) {
            //console.log(list[i]);
            var option = document.createElement("option");
            option.Value = list[i].id
            option.text = list[i][property] //.username
            //li.appendChild(document.createTextNode(list[i][property]));
            select.appendChild(option);
          }
        })
    })
}

/*function filterLists(filterId,listId) {
    var input, filter, ul, li, a, i;
    input = document.getElementById(filterId);
    filter = input.value.toUpperCase();
    ul = document.getElementById(listId);
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        //a = li[i].getElementsByTagName("li")[0];
        if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
*/

function getHomepage() {
  get('/homepage')
    .then(response => {
      if (response.ok)
        return response.text();
      }
    )
    .then(data => {
      console.log(data);
      document
        .querySelector('.Body')
        .innerHTML = data;
    })
    .catch(error => {
      console.log('Error is', error);
    })
  }

function getAdminPage() {
  get('/adminPage')
    .then(response => {
      if (response.ok)
        return response.text();
      }
    )
    .then(data => {
      //console.log(data);
      const admin_page = document.querySelector('.adminLists')
      admin_page.innerHTML = data;
      document.getElementById('deleteUserClick')
    })
    .catch(error => {
      console.log('Error is', error);
    })
  }

function deleteUser() {
  const userList = document.querySelector('.usersList')
  console.log(userList.value);
  var user_id = userList.value
  this.deleteAPI('/removeUser', {user_id} )
}

function deleteProject() {
  const project = document.querySelector('.projectsList')
  console.log(project.value);
  var id = project.value
  this.deleteAPI('/removeProjet', {id} )
}

function post(path, data) {
  return window.fetch(path, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

function get(path) {
  return window.fetch(path, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}

function deleteAPI(path,data) {
  console.log(JSON.stringify(data));
  return window.fetch(path+"/", {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}
