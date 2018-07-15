const values = ['BACKER','CREATOR','ADMIN'];

exports.up = function(knex, Promise) {
    return knex.schema.table('users', t => {
    	t.enu('premissions', values).notNullable()
    })
    .then(() => knex('users'))
    .then(users => Promise.all(users.map(setPremissions)))
  function setPremissions (user) {
    return knex('users').where({ id: user.id })
    .update({premissions: values[0]})
  }
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', t => {
    t.dropColumn('premissions')
  })
};
