
exports.up = function(knex, Promise) {
  return knex.schema.table('users', t => {
    	t.renameColumn('premissions', 'permissions')
    })
};

exports.down = function(knex, Promise) {

};
