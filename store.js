// JavaScript source code
const crypto = require('crypto')
const knex = require('knex')(require('./knexfile'))
const fs = require('fs-extra')
const template = require('es6-template-strings')
const LZString = require('./public/lz-string.js')
const values = ['BACKER', 'CREATOR', 'ADMIN'];

const projectPagetemplatePath = './Templates/ProjectPageTamplate.txt';
const projectBlockTemplatePath = './Templates/projectBlockTemplate.txt';
const homePageTemplatePath = './Templates/homePageTemplate.txt';
const adminPageTemplatePath = './Templates/AdminPageTemplate.txt';
const logInPageTemplatePath = './Templates/LogInPageTemplate.txt';
const signUpPageTemplatePath = './Templates/SignUpPageTemplate.txt';
const profilePageTemplatePath = './Templates/ProfilePageTemplate.txt';
const creatorPageTemplatePath = './Templates/CreateProjectPageTemplate.txt'
const editProjectTemplatePath = './Templates/EditProjectTemplate.txt'

module.exports = {
  saltHashPassword,

  getHomePage() {
    return generateHomePage();
  },

  getLoginPage() {
    return fs
      .readFile(logInPageTemplatePath)
      .then((logInPage) => {
        return logInPage.toString()
      })
  },

  getSignUpPage() {
    return fs
      .readFile(signUpPageTemplatePath)
      .then((signUpPage) => {
        return signUpPage.toString()
      })
  },

  getUpdatePage(data) {
    return fs
      .readFile(editProjectTemplatePath)
      .then((editProjectPage) => {
        var html = editProjectPage.toString()
        return {html}
      })
  },

  getAllBackers(id) {
    return generateBackersTable(id)
  },

  updateProject(data) {
    return saveAndReadSite(data)
  },

  getProfilePage(user) {
    return generateProfilePage(user)

  },

  getAdminPage() {
    return genarateAdminPage();
  },

  getCreatorPage() {
    return generateCreatorPage();
  },

  createUser({username, password}) {
    console.log(`Add user ${username} with password ${password}`)
    const {salt, hash} = saltHashPassword({password});
    return knex('users').insert({salt, encrypted_password: hash, username})
  },

  updatePermission(user) {
    return knex('users')
      .where({id: user.id})
      .update({permissions: 'CREATOR'})
  },

  authenticate({username, password}) {
    console.log(`Authenticating user ${username}`)
    return knex('users')
      .where({username})
      .then(([user]) => {
        var data = {
          success: false,
          id: '',
          permissions: ''
        }
        if (!user) {
          data.success = false
        } else {
          const {hash} = saltHashPassword({password, salt: user.salt})
            data.success = hash === user.encrypted_password,
            data.id = user.id,
            data.permissions = user.permissions
            return data;
          }
        })
    },

    createProject(data) {
      return knex('projects')
        .insert({
          user_id: data.user_id,
          project_name: data.project_name,
          start_date: data.start_date,
          end_date: data.end_date,
          backers: 0,
          investment: data.investment,
          pledged: 0
        })
        .then(() => {
          return saveAndReadSite(data);
        })
    },

    Invest(data) { //{ user_id, project_name, }
      //  console.log('Data = ', data);
      //  console.log(`user id: ${data.user_id} will invest in: ${data.project_name}
      //amount of: ${data.investment}`)
      return knex('projects')
        .where({project_name: data.project_name})
        .then(([project]) => {
          //  console.log(project);
          var numOfBackers;
          return knex('projectInvest')
            .where({user_id: data.user_id, project_id: project.id})
            .then(([investment]) => {
              if (investment) {
                numOfBackers = project.backers;
                return knex('projectInvest')
                  .update({
                    amount: investment.amount += parseInt(data.investment)

                  })
                  .where({user_id: data.user_id})
              } else {
                numOfBackers = ++project.backers;
                return knex('projectInvest').insert({
                  user_id: data.user_id,
                  project_id: project.id,
                  amount: parseInt(data.investment)
                })
              }
            })
            .then(() => {
              //    console.log('Project: ' + project.pledged + ' Data: ' + data.investment);
              return knex('projects')
                .where({project_name: data.project_name})
                .update({
                  backers: numOfBackers,
                  pledged: project.pledged += parseInt(data.investment)
                })
            })
        })
    },

    removeProject,

    //TODO: removeUser
    removeUser(data) {
      return knex('projects')
        .where({user_id: data.user_id})
        .then((projects) => {
          //  console.log("the length is: " + projects.length);
          for (var i = 0; i < projects.length - 1; i++) {
            //    console.log(projects);
            removeProject(projects[i])
          }
          if (projects.length > 0) {
            return removeProject(projects[projects.length - 1]).then(() => {
              //    console.log("before deleting user: ");
              return knex('users')
                .where({id: data.user_id})
                .del()
            })
          } else {
            return knex('users')
              .where({id: data.user_id})
              .del()
          }
        })
    },

    //TODO: updateProject
    /*updateProject(data) {
      var path = generateSitePath(data);
      var site = generateSiteFile(data);
      writeFile(path, site)
      return knex('project')
    },*/

    //TODO: retrieveProjectSite
    retrieveProjectSite(data) {
      //console.log('retrieveProjectSite ' + JSON.stringify(data));
      var path = generateSitePath(data);
      return getProjectSite(path).then((html) => {
        return fs
          .readJson(path)
          .then((projectData) => {
            return {html, projectData}
          })
      });
    }
  }

  //TODO: findAllUsers
  function findAllUsers() {
    return knex('users')
      .select()
      .then((users) => {
        return users;
      })
  }

  //TODO: findAllProjects
  function findAllProjects() {
    return knex('projects').select()
    //.then((projects) => {
    //    console.log("INSTORE: "+projects);
    //    return projects;
    //  })
  }

  function removeProject(data) {
    //console.log(data);
    return knex('projectInvest')
      .where({project_id: data.id})
      .del()
      .then(() => {
        return knex('projects')
          .select()
          .where({id: data.id})
          .then(([project]) => {
            return knex('users')
              .select('username')
              .where({id: project.user_id})
              .then(([username]) => {
                var projectData = {
                  user_name: username['username'],
                  project_name: project['project_name']
                }
                var path = generateSitePath(projectData)
                //console.log("PATH: " + path);
                return fs
                  .remove(path)
                  .then(() => {
                    return knex('projects')
                      .where({id: data.id})
                      .del()
                  })
              })
          })
      });
  }

  function saltHashPassword({
    password,
    salt = randomString()
  }) {
    console.log(`Salt ${salt} with password ${password}`)
    const hash = crypto
      .createHmac('sha512', salt)
      .update(password)
    return {salt, hash: hash.digest('hex')}
  }

  function randomString() {
    return crypto
      .randomBytes(4)
      .toString('hex')
  }

  function generateSitePath(data) {
    //console.log(data);
    return `./projects/${data.user_name}/${data.project_name}.json`;
  }

  function getProjectSite(path) {
    return fs
      .readJson(path)
      .then(data => {
        return generateSiteFile(data)
      });
  }

  function saveAndReadSite(data) {
    var path = generateSitePath(data);
    return fs
      .outputJson(path, data)
      .then(() => {
        return getProjectSite(path)
        //      console.log('AFTER READ! ');
      })
      .catch(err => {
        console.error(err)
      })
    }

  function calculateDays(end_date) {
    var today = new Date()
    end_date = Date.parse(end_date);

    return (end_date - today) / (1000 * 60 * 60 * 24);
  }

  function generateSiteFile(data) {
    return knex('projects')
      .where({user_id: data.user_id})
      .count()
      .then(count => {
        return knex('projects')
          .where({project_name: data.project_name})
          .then(([project]) => {
            var remaining_days = Math.floor(calculateDays(project.end_date))
            return fs
              .readFile(projectPagetemplatePath)
              .then(site => {
                site = site.toString();
                var percentage = Math.min((project.pledged / project.investment) * 100, 100);
                percentage = Math.floor(percentage)
                var visible = remaining_days > 0
                  ? "visible"
                  : "hidden";
                var images = generatePicturesBlock(data.project_images_data)
                return template(site, {
                  data,
                  count,
                  project,
                  images,
                  percentage,
                  remaining_days,
                  visible
                });
              })
          })
      })
  }

  function generateHomePage() {
    var allBlocks = '';
    return knex('projects')
      .select()
      .then((projects) => {
        for (var i = 0; i < projects.length - 1; i++) {
          generateProjectBlock(projects[i]).then(blockString => {
            allBlocks += blockString;
          })
        }
        if (projects.length > 0)
          return generateProjectBlock(projects[projects.length - 1])
            .then(blockString => {
              allBlocks += blockString;
              return allBlocks;
            })
            .then((allBlocks) => {
              return knex('projects')
                .sum('backers')
                .then(([backerSum]) => {
                  backerSum = backerSum['sum(`backers`)'];
                  return knex('projects')
                    .where('pledged', '>', knex.raw('projects.investment'))
                    .count()
                    .then(([fundedProjects]) => {
                      //console.log(fundedProjects);
                      fundedProjects = fundedProjects[`count(*)`].toString();
                      var date = new Date()
                      console.log(date);
                      return knex('projects')
                        .count()
                        .where('end_date', '>', date)
                        .then(([liveProjects]) => {
                          liveProjects = liveProjects[`count(*)`].toString();
                          return fs
                            .readFile(homePageTemplatePath)
                            .then(homepage => {
                              homepage = homepage.toString();
                              homepage = template(homepage, {allBlocks, date, backerSum, fundedProjects, liveProjects})
                              return homepage;
                            })
                        })
                    })
                })
            })
        })
  }

  function generateProjectBlock(project) {
    return knex('users')
      .select('username')
      .where({id: project.user_id})
      .then(([user]) => {
        //console.log(user);
        var user_name = user['username']
        var project_name = project.project_name
        var path = generateSitePath({user_name, project_name});
        //console.log("PATH: " + path);
        return fs
          .readJson(path)
          .then((projectFile) => {
            return fs
              .readFile(projectBlockTemplatePath)
              .then(block => {
                block = block.toString();
                var blockImage = projectFile.project_images_data[0]
                var remaining_days = Math.floor(calculateDays(project.end_date))
                var percentage = Math.floor((project.pledged / project.investment) * 100)
                var percentageWidth = Math.min(percentage, 100);
                var visible = remaining_days > 0
                  ? "visible"
                  : "hidden"
                return template(block, {
                  project,
                  projectFile,
                  blockImage,
                  percentage,
                  percentageWidth,
                  remaining_days,
                  visible
                });
              })
          })
      })
  }

  function genarateAdminPage() {
    return generateAdminUserTabel()
    .then(usersTable => {
      return generateAdminProjectTabel()
        .then(projectsTable => {
          return fs
            .readFile(adminPageTemplatePath)
            .then(adminPage => {
              adminPage = adminPage.toString()
              adminPage = template(adminPage, {usersTable, projectsTable})
              return adminPage;
            })
        })
    })
  }

  function generateAdminUserTabel() {
    var table = '<select class = "usersList" size = "10"> ${allOptions} </select>'
    var allOptions = ''
    var optionFormat = '<option value = ${user.id} >${user.username}</option>'
    return findAllUsers().then(users => {
      for (var i = 0; i < users.length - 1; i++) {
        var user = users[i]
        allOptions += template(optionFormat, {user})
      }
      var user = users[users.length - 1]
      allOptions += template(optionFormat, {user})
      table = template(table, {allOptions})
      return table
    });
  }

  function generateAdminProjectTabel() {
    var table = '<select class = "projectsList" size = "10"> ${allOptions} </select>'
    var allOptions = ''
    var optionFormat = '<option value = ${project.id} >${project.project_name}</option>'
    return findAllProjects().then(projects => {
      for (var i = 0; i < projects.length - 1; i++) {
        var project = projects[i]
        allOptions += template(optionFormat, {project})
      }
      if (projects.length > 0) {
        var project = projects[projects.length - 1]
        allOptions += template(optionFormat, {project})
      }
      table = template(table, {allOptions})
      return table
    });
  }

  function generateProfilePage(user) {
    //console.log("store user: ");
    //console.log(user);
    return knex('projects')
      .select()
      .where({user_id: user.id})
      .then((projects) => {
        var table = '<select class = "projectsList" size="10"> ${allOptions} </select>'
        var allOptions = ''
        var optionFormat = '<option value = ${project.id} >${project.project_name}</option>'
        for (var i = 0; i < projects.length - 1; i++) {
          var project = projects[i]
          //console.log(project);
          allOptions += template(optionFormat, {project})
        }
        if (projects.length > 0) {
          var project = projects[projects.length - 1]
          allOptions += template(optionFormat, {project})
        }
        table = template(table, {allOptions})
        var projectsTable = table
        return projectsTable
      })
      .then((projectsTable) => {
        return knex('projectInvest')
          .select('project_id')
          .where({user_id: user.id})
          .then((projectsId) => {
            return knex('projects')
              .select()
              .then((allProjects) => {
                var projectsList = []
                var allProjectsIds = []
                for (var i = 0; i < projectsId.length; i++) {
                  allProjectsIds.push(projectsId[i].project_id)
                }
                for (var i = 0; i < allProjects.length; i++) {
                  if (allProjectsIds.includes(allProjects[i].id)) {
                    projectsList.push({project_name: allProjects[i].project_name, id: allProjects[i].id})
                  }
                }
                return projectsList
              })
              .then((projectsList) => {
                var table = '<select class = "pledgedList" size = "10"> ${allOptions} </select>'
                var allOptions = ''
                var optionFormat = '<option value = ${project.id} >${project.project_name}</option>'
                for (var i = 0; i < projectsList.length - 1; i++) {
                  var project = projectsList[i]
                  //console.log(project);
                  allOptions += template(optionFormat, {project})
                }
                if (projectsList.length > 0) {
                  var project = projectsList[projectsList.length - 1]
                  //console.log(project);
                  allOptions += template(optionFormat, {project})
                }
                table = template(table, {allOptions})
                var projectsPledagedTable = table
                //console.log(projectsPledagedTable);
                return projectsPledagedTable
              })
              .then((projectsPledagedTable) => {
                return fs
                  .readFile(profilePageTemplatePath)
                  .then((profilePage) => {
                    profilePage = profilePage.toString()
                    var username = user.username
                    var projects = projectsTable
                    var pledges = projectsPledagedTable
                    profilePage = template(profilePage, {username, projects, pledges})
                    return profilePage
                  })
              })
          })
      })
  }

  function generateBackersTable(id) {
    return knex('projectInvest')
      .select('user_id')
      .where({project_id: id})
      .then((usersIdList) => {
        return knex('users')
          .select()
          .then((allUsers) => {
            var allUsersList = []
            var allUsersIds = []
            for (var i = 0; i < usersIdList.length; i++) {
              allUsersIds.push(usersIdList[i].user_id)
            }
            for (var i = 0; i < allUsers.length; i++) {
              if (allUsersIds.includes(allUsers[i].id)) {
                allUsersList.push({user_name: allUsers[i].username})
              }
            }
            var table = '<select class = "backersList" size = "10"> ${allOptions} </select>'
            var allOptions = ''
            var optionFormat = '<option disabled>${user.user_name}</option>'
            for (var i = 0; i < allUsersList.length - 1; i++) {
              var user = allUsersList[i]
              //console.log(project);
              allOptions += template(optionFormat, {user})
            }
            if (allUsersList.length > 0) {
              var user = allUsersList[allUsersList.length - 1]
              //console.log(project);
              allOptions += template(optionFormat, {user})
            }
            table = template(table, {allOptions})
            return table
          })
      })
  }

  function generateCreatorPage() {
    return fs
      .readFile(creatorPageTemplatePath)
      .then(creatorPage => {
        creatorPage = creatorPage.toString()
        return creatorPage
      })
  }

  function generatePicturesBlock(imagesData) {
    var imageTemplate = '<img src="${image}" alt="projcet pic" width="400" height="400">'
    var imageBlock = ""
    for (var i = 0; i < imagesData.length; i++) {
      var image = imagesData[i]
      imageBlock += template(imageTemplate, {image});
      console.log(imageBlock);
    }
    return imageBlock
  }
