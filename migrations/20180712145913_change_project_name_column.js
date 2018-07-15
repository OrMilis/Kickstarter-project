
exports.up = function(knex, Promise) {
  return knex.schema.table('projects', t => {
    	t.renameColumn('name', 'project_name')
    })
};

exports.down = function(knex, Promise) {
  
};
