
exports.up = function(knex, Promise) {
   return knex.schema.createTable('projects', function (t) {
   	t.integer('user_id').unsigned()
   	t.foreign('user_id').references('users.id')
   	t.string('name')
   	t.dateTime('start_date')
   	t.dateTime('end_date')
   	t.integer('backers')
   	t.integer('investment')
   	t.integer('pledged')
   })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('projects')
};
