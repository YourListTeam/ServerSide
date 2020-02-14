const {Pool} = require('pg');

const pool = new Pool();


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
function get_user_by_uuid(response, uuid) {
	pool.query("SELECT * FROM Users WHERE UUID=$1;",[uuid]).then(ret => {
		if (ret.rows) {
			response.status(200).json(ret.rows[0]);
		} else {
			response.status(404);
		}
	}).catch(e => {
		console.error(e.stack);
        response.status(500);
	});
}

function get_list_by_lid(response, lid) {
	pool.query("SELECT * FROM Lists WHERE LID=$1;",[lid]).then(ret => {
		if (ret.rows) {
			response.status(200).json(ret.rows[0]);
		} else {
			response.status(404);
		}
	}).catch(e => {
		console.error(e.stack);
        response.status(500);
	});
}

function get_auth_by_id(response, uuid,lid) {
	pool.query("SELECT * FROM Auth WHERE ((UUID=$1) AND (LID=$2)) ;",[uuid,lid]).then(ret => {
		if (ret.rows) {
			response.status(200).json(ret.rows[0]);
		} else {
			response.status(404);
		}
	}).catch(e => {
		console.error(e.stack);
        response.status(500);
	});
}

function create_list(response, uuid, lid, lname, rbg) {
	// insert the new lists into Lists
	var currentDate= new Date();
	// currentDate upon creation creates the current date
	// which can be used to determine its modification date
	pool.query("INSERT INTO Lists (LID, listname, Colour, Modified) VALUES ($1, $2, $3, $4);",[lid,lname,rbg,currentDate]).then(ret => {
	response.status(200).json();
	}).catch(e => {
		console.error(e.stack);
        response.status(500);
	});
}

function add_permission(response, uuid, lid) {
	// insert the new list's user's permissions into Auth
	// as this only occurs when the user is creating a list, they are the admin
	// so they have full permissions
	pool.query("INSERT INTO Auth (UUID, LID, Permission) VALUES ($1, $2, E'\\F')",[uuid,lid]).then(ret => {
	response.status(200).json();
	}).catch(e => {
		console.error(e.stack);
		response.status(500);
	});
}


module.exports = {
	db_pool: pool,
	get_user: get_user_by_uuid,
	set_name: set_name,
	set_home: set_home,
	set_email: set_email,
	does_user_exist: does_user_exist
	get_list: get_list_by_lid,
	create_new_list: create_list,
	get_auth: get_auth_by_id,
	create_auth: add_permission
}