exports.up = function (knex) {
  return knex.schema.createTable('Users', function (table) {
    table.increments('id').primary()
    table.string('username').notNullable()
    table.string('password').notNullable()
    table.timestamps(false, true)
  })
}
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users')
}