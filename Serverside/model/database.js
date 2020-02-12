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

function set_name(name, uuid){
	pool.query("UPDATE users SET name=$1 WHERE UUID=$2;", [name, uuid]);
}

function set_email(email, uuid){
	pool.query("UPDATE users SET email=$1 WHERE UUID=$2;", [email, uuid]);
}

function set_home(home, uuid){
	pool.query("UPDATE users SET homelocation=$1 WHERE UUID=$2", [home, uuid]);
}


module.exports = {
	db_pool: pool,
	get_user: get_user_by_uuid,
	set_name: set_name,
	set_home: set_home,
	set_email: set_email
}