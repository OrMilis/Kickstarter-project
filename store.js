// JavaScript source code
const crypto = require('crypto')
const knex = require('knex')(require('./knexfile'))
const fs = require('fs-extra')
const template = require('es6-template-strings')
const values = ['BACKER', 'CREATOR', 'ADMIN'];

const projectPagetemplatePath = './Templates/ProjectPageTamplate.txt';
const projectBlockTemplatePath = './Templates/projectBlockTemplate.txt';
const homePageTemplatePath = './Templates/homePageTemplate.txt';
const adminPageTemplatePath = './Templates/AdminPageTemplate.txt';
const logInPageTemplatePath = './Templates/LogInPageTemplate.txt';

module.exports = {
  saltHashPassword,

  getHomePage() {
    return generateHomePage();
  },

  getLoginPage(){
    return fs
    .readFile(logInPageTemplatePath)
    .then((logInPage) => {
      return logInPage.toString()
    })
  },

  getAdminPage() {
    return genarateAdminPage();
  },

  createUser({username, password}) {
    console.log(`Add user ${username} with password ${password}`)
    const {salt, hash} = saltHashPassword({password});
    return knex('users').insert({salt, encrypted_password: hash, username})
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
          return knex('users')
            .where({id: data.user_id})
            .update({permissions: values[1]})
            .then(() => {
              return saveAndReadSite(data);
            })
        })
    },

    Invest(data) { //{ user_id, project_name, }
      console.log('Data = ', data);
      console.log(`user id: ${data.user_id} will invest in: ${data.project_name}
  	amount of: ${data.investment}`)
      return knex('projects')
        .where({project_name: data.project_name})
        .then(([project]) => {
          console.log(project);
          var numOfBackers;
          return knex('projectInvest')
            .where({user_id: data.user_id, project_id: project.id})
            .then(([investment]) => {
              if (investment) {
                numOfBackers = project.backers;
                return knex('projectInvest').update({
                  amount: investment.amount += parseInt(data.investment)
                })
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
              console.log('Project: ' + project.pledged + ' Data: ' + data.investment);
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
          console.log("the length is: " + projects.length);
          for (var i = 0; i < projects.length - 1; i++) {
            console.log(projects);
            removeProject(projects[i])
          }
          if (projects > 0) {
            return removeProject(projects[projects.length - 1]).then(() => {
              console.log("before deleting user: ");
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
    updateProject(data) {
      var path = generateSitePath(data);
      var site = generateSiteFile(data);
      writeFile(path, site)
      return knex('project')
    },

    //TODO: retrieveProjectSite
    retrieveProjectSite(data) {
      console.log('retrieveProjectSite ' + JSON.stringify(data));
      var path = generateSitePath(data);
      return getProjectSite(path);
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
    console.log(data);
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
                console.log("PATH: " + path);
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
    console.log(data);
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
        console.log('AFTER READ! ');
      })
      .then(file => {
        return file;
      })
      .catch(err => {
        console.error(err)
      })
    }

  function calculateDays(start_date, end_date) {
    start_date = Date.parse(start_date);
    end_date = Date.parse(end_date);

    return (end_date - start_date) / (1000 * 60 * 60 * 24);
  }

  function generateSiteFile(data) {
    return knex('projects')
      .where({user_id: data.user_id})
      .count()
      .then(count => {
        return knex('projects')
          .where({project_name: data.project_name})
          .then(([project]) => {
            var remaining_days = Math.floor(calculateDays(project.start_date, project.end_date))
            return fs
              .readFile(projectPagetemplatePath)
              .then(site => {
                site = site.toString();
                var percentage = Math.min((project.pledged / project.investment) * 100, 100);
                percentage = Math.floor(percentage)
                return template(site, {data, count, project, percentage, remaining_days});
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
                    .count()
                    .where('pledged', '>', 'investment')
                    .then(([fundedProjects]) => {
                      fundedProjects = fundedProjects[`count(*)`].toString();
                      var date = new Date()
                      return knex('projects')
                        .count()
                        .where(date, '<', 'end_date')
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
        return fs
          .readFile(projectBlockTemplatePath)
          .then(block => {
            block = block.toString();
            var remaining_days = Math.floor(calculateDays(project.start_date, project.end_date))
            var percentage = Math.min((project.pledged / project.investment) * 100, 100);
            percentage = Math.floor(percentage)
            var username = user['username']
            return template(block, {project, username, percentage, remaining_days});
          })
      })
  }

  function genarateAdminPage() {
    var adminTables = ''
    return generateAdminUserTabel().then(usersTabel => {
      adminTables += usersTabel
      return generateAdminProjectTabel()
        .then(projectsTable => {
          adminTables += projectsTable
          return adminTables
        })
        .then(adminTables => {
          return fs
            .readFile(adminPageTemplatePath)
            .then(adminPage => {
              adminPage = adminPage.toString()
              adminPage = template(adminPage, {adminTables})
              return adminPage
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
