
exports.up = function(knex, Promise) {
  return knex.schema.table('projects', table =>{
    table.increments('id').primary()
  })
};

exports.down = function(knex, Promise) {

};
