// JavaScript source code
const crypto = require('crypto')
const knex = require('knex')(require('./knexfile'))
const fs = require('fs-extra')
const template = require('es6-template-strings')

module.exports = {
  saltHashPassword,

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
          return saveAndReadSite(data);
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
        var numOfBackers ;
        return knex('projectInvest').where({user_id:data.user_id,project_id: project.id})
        .then(([investment]) => {
          if(investment) {
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

    //TODO: findAllProjects
    findAllProjects() {
      return knex('projects').select();
    },

    //TODO: findAllUsers
    findAllUsers() {
      return knex('users').select()
    },

    //TODO: removeProject
    removeProject(data) {
      return knex('projects')
        .where({project_id: data.project_id})
        .del();
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
            var remaining_days = calculateDays(project.start_date, project.end_date)
            var path = './Templates/ProjectPageTamplate.txt';
            return fs.readFile(path)
            .then(site => {
              site = site.toString();
              return template(site, {data, count, project, remaining_days});
            })
          })
      })
  }
