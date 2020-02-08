const {Pool} = require('pg');

const pool = new Pool();

function get_user_by_uuid(uuid) {
	return pool.query("SELECT * FROM Users WHERE UUID=$1;",[uuid]);
}

module.exports = {
	db_pool: pool,
	get_user: get_user_by_uuid
}