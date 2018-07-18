// JavaScript source code
const crypto = require('crypto')
const knex = require('knex')(require('./knexfile'))
const fs = require('fs-extra')

module.exports = {
	saltHashPassword,

	createUser ({ username, password }) {
    console.log(`Add user ${username} with password ${password}`)
    const {salt, hash} = saltHashPassword({password});
    return knex('users').insert({salt, encrypted_password:hash, username})
  },

  authenticate ({ username, password }) {
    console.log(`Authenticating user ${username}`)
    return knex('users').where({ username })
      .then(([user]) => {
				var data = {
					success: false,
					id: '',
					permissions: ''
					}
        if (!user){
					data.success = false
				} else {
					const { hash } = saltHashPassword({password, salt: user.salt})
					data.success = hash === user.encrypted_password,
					data.id = user.id,
					data.permissions = user.permissions
					return data;
				}
      })
  },

  createProject(data) {
  	return knex('projects').insert({
			user_id: data.user_id,
			project_name: data.project_name,
			start_date: data.start_date,
			end_date: data.end_date,
			backers: data.backers,
			investment: data.investment,
			pledged: data.pledged})
			.then(() => {
				var {path, site} = generateSiteAndPath(data);
				return fs.outputJson(path, {html: site})
				.then(() => {
					return fs.readJson(path)
					console.log('AFTER READ! ');
				})
				.then(file => {
					console.log('In createProject ' + file);
					return file;
				})
				.catch(err => {
					console.error(err)
				})
			})
	},

	Invest(data) { //{ user_id, project_name, }
		console.log('Data = ', data);
  	console.log(`user id: ${data.user_id} will invest in: ${data.project_name}
  	amount of: ${data.investment}`)
		return knex('projects').where({project_name: data.project_name})
		.then(([project]) => {
			console.log(project);
			return knex('projects').where({project_name: data.project_name})
			.update({backers: ++project.backers,
				pledged: project.pledged+=data.investment})
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

	//TODO: findAllUsers

	//TODO: removeProject

	//TODO: updateProject

	//TODO: getProjectSite
}

function saltHashPassword ({password, salt = randomString()}) {
	console.log(`Salt ${salt} with password ${password}`)
  const hash = crypto.createHmac('sha512', salt).update(password)
  return {salt, hash: hash.digest('hex')}
}

function randomString(){
	return crypto.randomBytes(4).toString('hex')
}

function generateSiteAndPath(data){
	var site =
	`    <section id="showcase" style="height:30vh; color:#f6f6f6; background:blue">
	        <div class="container" style="width:50%; border:solid; border-width:10px; border-radius:0px; border-color:#f6f6f6; background-color: rgba(81, 81, 81, 0.43)">
	            <h1>${data.project_name}</h1>
	        </div>
	    </section>

	    <div class="container">
	        <h2 style="text-align:center">About</h2>
	        <p style="line-height:2">${data.project_info}</p>
	    </div>`;
			var path = `./projects/${data.user_name}/${data.project_name}.json`;
			return {path, site}
}
