
exports.up = function(knex, Promise) {
  return knex.schema.createTable('projectInvest', function (table){
    table.integer('project_id').unsigned()
    table.foreign('project_id').references('projects.user_id')
    table.integer('user_id').unsigned()
    table.foreign('user_id').references('users.id')
<<<<<<< HEAD
=======
<<<<<<< HEAD
  })
=======
  }
>>>>>>> b8ddceaf7317ecc2b27ae6a360992914f7bd577b
>>>>>>> c5c4937d80ed9cae7edca0dae9e03e9461f94e1a
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('projectInvest')

};
