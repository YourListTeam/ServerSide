const {Pool} = require('pg');

const pool = new Pool();

function get_user_by_uuid(response, uuid) {
	pool.query("SELECT * FROM Users WHERE UUID=$1;",[uuid]).then(ret => {
		if (ret.rows) {
			response.status(200).json(ret.rows[0]);
		} else {
			response.status(404);
		}
	}).catch(e => {
		console.error(e.stack);
        res.status(500);
	});
}

module.exports = {
	db_pool: pool,
	get_user: get_user_by_uuid
}