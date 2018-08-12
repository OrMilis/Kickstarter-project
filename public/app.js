var logedInUser = {
  username: '',
  id: -1,
  permissions: ''
}

var currentProject = {
  project_name: '',
  user_name: '',
  user_id: '',
  start_date: '',
  end_date: '',
  investment: '',
  project_info: '',
  project_video: '',
  project_image: '',
  project_abstract: ''
}

var uploadImageIndex = 1
/*
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
*/
/*const Login = document.querySelector('.Body')
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
  })*/

/*const CreateProject = document.querySelector('.CreateProject')
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
  })*/
function getBase64(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  });
}

function createProject() {
  const CreateProject = document.querySelector('.CreateProject')
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
  var project_images = CreateProject.getElementsByClassName('project_images') //querySelector('.project_images')
  console.log(project_images.length);
  var project_images_data = []
  var upload_promises = []
  for (var i = 0; i < project_images.length; i++) {
    upload_promises.push(getBase64(project_images[i].files[0]))
  }
  console.log("upload: " + upload_promises.length);
  Promise
    .all(upload_promises)
    .then(imagesData => {
      //image = LZString.compress(image)
      project_images_data = imagesData;

      console.log(project_images_data.length);
      //console.log(JSON.stringify(project_images_data));

      const project_abstract = CreateProject
        .querySelector('.project_abstract')
        .value;
      //project_image = projectImageData.toString();
      //console.log(btoa(project_image.toString()));

      //console.log(JSON.stringify(project_image));
      /*const new_image = document
        .getElementById('image_0')
        .files[0]*/
      console.log({
        user_name,
        user_id,
        project_name,
        start_date,
        end_date,
        investment,
        project_info,
        project_video,
        project_images_data,
        project_abstract
      });
      post('/CreateProject', {
        user_name,
        user_id,
        project_name,
        start_date,
        end_date,
        investment,
        project_info,
        project_video,
        project_images_data,
        project_abstract
      })
        .then(response => {
          if (response.ok)
            return response.text();
          }
        )
        .then(data => {
          getProjectPage(user_name, project_name)
        })
        .catch(error => {
          console.log('Error is', error);
        })
      })
}

function updateProject() {
  const UpdateProject = document.querySelector('.UpdateProject')
  currentProject.project_info = UpdateProject
    .querySelector('.project_info')
    .value
  currentProject.project_video = UpdateProject
    .querySelector('.project_video')
    .value
  currentProject.project_image = UpdateProject
    .querySelector('.project_image')
    .value
  currentProject.project_abstract = UpdateProject
    .querySelector('.project_abstract')
    .value
    post('/updateProject', currentProject)
    .then((response) => {
      if (response.ok)
        return response.text();
      }
    )
    .then((data) => {
      document
        .querySelector('.Body')
        .innerHTML = data;
    })
}

function editProjectPage() {
  post('/getUpdatePage', {
    user_name: logedInUser.username,
    project_name: currentProject.project_name
  })
    .then((response) => {
      if (response.ok)
        return response.text();
      }
    )
    .then((data) => {
      data = JSON.parse(data)
      document
        .querySelector('.Body')
        .innerHTML = data.html;
      const UpdateProject = document.querySelector('.UpdateProject')
      UpdateProject
        .querySelector('.project_info')
        .value = currentProject.project_info;
      UpdateProject
        .querySelector('.project_video')
        .value = currentProject.project_video;
      UpdateProject
        .querySelector('.project_image')
        .value = currentProject.project_image;
      UpdateProject
        .querySelector('.project_abstract')
        .value = currentProject.project_abstract;
    })
}

/*
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
*/
function invest() {
  if (logedInUser.id == -1) {
    alert("Please Log In")
    return
  }
  const Invest = document.querySelector('.Pledge')
  const user_id = logedInUser.id;
  const project_name = currentProject.project_name
  const investment = Invest
    .querySelector('.amount')
    .value
    post('/Invest', {user_id, project_name, investment})
    .then(() => {
      getProjectPage(currentProject.user_name, currentProject.project_name)
    })
}
/*const Project = document.querySelector('.GetProject')
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
  })*/

function getProjectPage(user_name, project_name) {
  post('/project', {user_name, project_name})
    .then(response => {
      if (response.ok)
        return response.text();
      }
    )
    .then(data => {
      data = JSON.parse(data)
      currentProject = data
        .projectData
        document
        .querySelector('.Body')
        .innerHTML = data.html;
      //console.log(data);
      editProject = document.querySelector('.editProject')
      if (logedInUser.username === currentProject.user_name) {
        editProject.style.visibility = "visible"
      }
    })
    .catch(error => {
      console.log('Error is', error);
    })
  }

function closeProjectPage() {
  editProject = document.querySelector('.editProject')
  editProject.style.visibility = "hidden"
}

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
/*function buildSelect(path, selectElement, property) {
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
}*/

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
      //console.log(data);
      document
        .querySelector('.Body')
        .innerHTML = data;
      closeProjectPage()
    })
    .catch(error => {
      console.log('Error is', error);
    })
  }

function getLoginPage() {
  get('/logInPage')
    .then(response => {
      if (response.ok)
        return response.text()
    })
    .then(data => {
      document
        .querySelector('.Body')
        .innerHTML = data;

      closeProjectPage()
    })
    .catch(error => {
      console.log('Error is', error)
    })
  }

function getSignUpPage() {
  get('/signUpPage')
    .then(response => {
      if (response.ok)
        return response.text()
    })
    .then(data => {
      document
        .querySelector('.Body')
        .innerHTML = data
      closeProjectPage()
    })
    .catch(error => {
      console.log('Error is', error);
    })
  }

function getProfilePage() {
  closeProjectPage()
  if (logedInUser.permissions == 'ADMIN')
    getProfilePageAsAdmin()
  else
    getProfilePageNostAsAdmin()
}

function getProfilePageAsAdmin() {
  get('/adminPage')
    .then(response => {
      if (response.ok)
        return response.text();
      }
    )
    .then(data => {
      //console.log(data);
      const admin_page = document.querySelector('.Body')
      admin_page.innerHTML = data;
      //document.getElementById('deleteUserClick')
    })
    .catch(error => {
      console.log('Error is', error);
    })
  }

function getProfilePageNostAsAdmin() {
  //console.log("app loged in user: ");
  //console.log(logedInUser);
  post('/profilePage', {logedInUser})
    .then(response => {
      if (response.ok)
        return response.text();
      }
    )
    .then(data => {
      //console.log(data);
      const backer_page = document.querySelector('.Body')
      backer_page.innerHTML = data;
    })
    .then(() => {
      if (logedInUser.permissions == "BACKER") {
        const prjoectsList = document.querySelector('.projectsList')
        prjoectsList.style.visibility = "hidden"
      } else if (logedInUser.permissions == 'CREATOR') {
        const beCreator = document.querySelector('.beCreator')
        beCreator.style.visibility = "hidden"
      }
    })
    .catch(error => {
      console.log('Error is', error);
    })
  }

function getCreatorPage() {
  get('/creatorPage')
    .then(response => {
      if (response.ok)
        return response.text();
      }
    )
    .then(data => {
      uploadImageIndex = 1
      //console.log(data);
      const creatorPage = document.querySelector('.Body')
      creatorPage.innerHTML = data;
      closeProjectPage()
      addAnotherFile()
    })
    .catch(error => {
      console.log('Error is', error);
    })
  }

function becomeCreator() {
  const createTab = document.querySelector('.createProjectTab')
  createTab.style.visibility = "visible"
  put('/updatePermission', {logedInUser}).then(response => {
    logedInUser.permissions = 'CREATOR'
    getProfilePage()

  })
}

/*
  get('/profilePage')
    .then(response => {
      if (response.ok)
        return response.text();
      }
    )
    .then(data => {
      document
        .querySelector('.Body')
        .innerHTML = data
    })
    .catch(error => {
      console.log('Error is', error);
    })
  }
*/
function logIn() {
  const Login = document.querySelector('.Body')
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
      const createTab = document.querySelector('.createProjectTab')
      if (data.permissions == 'CREATOR') {
        createTab.style.visibility = "visible"
      } else {
        createTab.style.visibility = "hidden"
      }
      const profileTab = document.querySelector('.profileTab')
      profileTab.style.visibility = "visible"
      //const loginTab = document.querySelector('.loginTab')
      //loginTab.style.visibility = "hidden"
      profileTab.innerHTML = logedInUser.username;
      console.log(data);
      console.log(logedInUser);
      getProfilePage()
    })
    .then(() => {
      const logInButton = document.querySelector('.loginTab')
      logInButton.innerHTML = "Sign out"
      logInButton.onclick = logOut
    })
    .catch(error => {
      console.log('Error is', error);
    })
  }

function logOut() {
  logedInUser.username = ""
  logedInUser.id = -1
  logedInUser.permissions = ''
  const logInButton = document.querySelector('.loginTab')
  logInButton.innerHTML = "Log In"
  logInButton.onclick = getLoginPage
  const profileTab = document.querySelector('.profileTab')
  profileTab.style.visibility = "hidden"
  getHomepage()
}

function signUp() {
  const CreateUser = document.querySelector('.Body')
  const username = CreateUser
    .querySelector('.username')
    .value
  const password = CreateUser
    .querySelector('.password')
    .value
    post('/createUser', {username, password})
    .then(() => {
      logIn()
    })
}

function deleteUser() {
  const userList = document.querySelector('.usersList')
  //console.log(userList.value);
  var user_id = userList
    .value
    this
    .deleteAPI('/removeUser', {user_id})
}

function getAllBackers() {
  const backersList = document.querySelector('.backersList')
  const projectList = document.querySelector('.projectsList')
  var id = projectList
    .value
    console
    .log(id);
  post('/getAllBackers', {id})
    .then((response) => {
      if (response.ok)
        return response.text();
      }
    )
    .then((data) => {
      backersList.innerHTML = data
    })
}

function deleteProject() {
  const project = document.querySelector('.projectsList')
  console.log(project.value);
  var id = project
    .value
    this
    .deleteAPI('/removeProject', {id})
}

function addAnotherFile() {
  var upload_file = document.querySelector('.upload_file')
  var input = document.createElement("input")
  input.type = "file";
  input
    .classList
    .add("project_images");
  upload_file.appendChild(input)

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

function deleteAPI(path, data) {
  //console.log(JSON.stringify(data));
  return window.fetch(path + "/", {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

function put(path, data) {
  return window.fetch(path, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}
