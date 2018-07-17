// JavaScript source code
const crypto = require('crypto')
const knex = require('knex')(require('./knexfile'))

module.exports = {
	saltHashPassword, createUser ({ username, password }) {
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
		console.log('Data = ', data);
  	console.log(`Project created: ${data.user_id}, ${data.project_name},
  		${data.start_date}, ${data.end_date}, ${data.backers},
  		 ${data.investment}, ${data.pledged}`)
  	return knex('projects').insert({
			user_id: data.user_id,
			project_name: data.project_name,
			start_date: data.start_date,
			end_date: data.end_date,
			backers: data.backers,
			investment: data.investment,
			pledged: data.pledged});
  },

	Invest(data) { //{ user_id, project_name, }
		console.log('Data = ', data);
  	console.log(`user id: ${data.user_id} will invest in: ${data.project_name}
  	amount of: ${data.investment}`)
		return knex('projects').where({project_name: data.project_name})
		.then(([project]) => {
			console.log(project);
			project.backers++;
			project.pledged+=data.investment
	  	return knex('projectInvest').insert({
				user_id: data.user_id,
				project_id: project.id
				});
		})

  }

}

function saltHashPassword ({password, salt = randomString()}) {
	console.log(`Salt ${salt} with password ${password}`)
  const hash = crypto.createHmac('sha512', salt).update(password)
  return {salt, hash: hash.digest('hex')}
}

function randomString(){
	return crypto.randomBytes(4).toString('hex')
}
