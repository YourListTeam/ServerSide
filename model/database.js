const {Pool} = require('pg');

const pool = new Pool();

function get_user_by_uuid(uuid) {
	return pool.query("SELECT * FROM Users WHERE UUID=$1;",[uuid]);
}

function does_user_exist(uuid){
	return pool.query("SELECT * FROM Users WHERE UUID=$1;",[uuid]) == true;
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
	set_email: set_email,
	does_user_exist: does_user_exist
}