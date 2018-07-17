
exports.up = function(knex, Promise) {
  return knex.schema.table('projectInvest', table =>{
    table.integer('amount')
  })
};

exports.down = function(knex, Promise) {

};
