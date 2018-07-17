
exports.up = function(knex, Promise) {
  return knex.schema.createTable('projectInvest', function (table){
    table.integer('project_id').unsigned()
    table.foreign('project_id').references('projects.user_id')
    table.integer('user_id').unsigned()
    table.foreign('user_id').references('users.id')
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('projectInvest')

};
