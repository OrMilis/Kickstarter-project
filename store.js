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

  createProject(project_data) {
  	console.log(`Project created: ${project_data.name},
  		${start_date}, ${end_date}, ${backers},
  		 ${investment}, ${pledged}`)
  	return knex('projects').insert({project_name, start_date, end_date, backers, investment, pledged})
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
