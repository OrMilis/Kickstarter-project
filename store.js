// JavaScript source code
const crypto = require('crypto')
const knex = require('knex')(require('./knexfile'))
const fs = require('fs-extra')

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
        .then(() => {return saveAndReadSite(data);})
    },

    Invest(data) { //{ user_id, project_name, }
      console.log('Data = ', data);
      console.log(`user id: ${data.user_id} will invest in: ${data.project_name}
  	amount of: ${data.investment}`)
      return knex('projects')
        .where({project_name: data.project_name})
        .then(([project]) => {
          console.log(project);
          return knex('projects')
            .where({project_name: data.project_name})
            .update({
              backers: ++project.backers,
              pledged: project.pledged += data.investment
            })
            .then(() => {
              return knex('projectInvest').insert({
                user_id: data.user_id,
                project_id: project.id,
                amount: parseInt(data.investment)
              });
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
		return fs.readJson(path)
		.then(data => {
			return generateSiteFile(data)
		});
  }

  function saveAndReadSite(data) {
    var path = generateSitePath(data);
    return fs.outputJson(path, data)
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

    function calculateDays(start_date, end_date){
      start_date = Date.parse(start_date);
      end_date = Date.parse(end_date);

      return (end_date-start_date) / (1000*60*60*24);
    }

		function generateSiteFile(data) {
      return knex('projects').where({user_id: data.user_id}).count()
      .then(count => {
        return knex('projects').where({project_name: data.project_name})
        .then(([project]) => {
          var remaining_days = calculateDays(project.start_date, project.end_date)
          var site =
          `<div class="profile_title container">
            <span class="profile box">
                <img src="./static_web/profile_pic.png" alt="profile pic" width="75" height="75"> <br />
                <a>BY ${data.user_name}</a> <br />
                <a href="">${count[0]['count(*)']} created</a>
            </span>
            <span class = "title box">
              <h1>
                ${data.project_name}
              </h1>
              <p>
                SHORT_ABSTRACT
              </p>
            </span>
          </div>
        <div class="video_statistics container">
          <span class="video box" style="width:50%">
            <video width="100%" controls>
              <source src="${data.project_video}" type="video/mp4">
            </video>
          </span>
          <span class="statistics box">
            <div id="myProgress">
              <div id="myBar" style="width:${(project.pledged/project.investment) * 100}%"></div>
            </div>
            <div>
              <p>
                <a>${project.pledged}</a> <br />
                <a>pledged of ${project.investment} goal</a>
              </p>
            </div>
            <div>
              <p>
                <a>${project.backers}</a><br />
                <a>backers</a>
              </p>
            </div>
            <div>
              <p>
                <a>${remaining_days}</a> <br/>
                <a>days to go</a>
              </p>
            </div>
          </span>
        </div>
        <div class="info_pic container"
        <span class="info box" >
          <h3>
            About
          </h3>
          <p>
            ${data.project_info}
          </p>
        </span>
        <span class="picture box" >
          <img src="${data.project_image}" alt="projcet pic" width="400" height="400">
        </span>
      </body>`
          return site;
        })
      })
	  }
