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

function get_list_by_lid(response, lid) {
	pool.query("SELECT * FROM Lists WHERE LID=$1;",[lid]).then(ret => {
		if (ret.rows) {
			response.status(200).json(ret.rows[0]);
		} else {
			response.status(404);
		}
	}).catch(e => {
		console.error(e.stack);
        res.status(500);
	});
	console.log("list exists, has id $1",[lid])
}

function get_auth_by_uuid(response, uuid) {
	pool.query("SELECT * FROM Auth WHERE UUID=$1;",[uuid]).then(ret => {
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

function get_items_by_iid(response, iid) {
	pool.query("SELECT * FROM Items WHERE IID=$1;",[iid]).then(ret => {
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

function create_list(response, uuid, lid, lname, rbg) {
	var currentDate= new Date();
	pool.query("INSERT INTO  Lists (LID, listname, Colour, Modified) VALUES ($1, $2, $3, $4);",[lid,lname,rbg,currentDate]).then(ret => {
	response.status(200).json();
	}).catch(e => {
		console.error(e.stack);
        res.status(500);
	});
	// pool.query("INSERT INTO Auth (UUID, LID, Permission) VALUES ($1 $2 E'\\1111)",[uuid,lid]).then(ret => {
	// response.status(200).json();
	// }).catch(e => {
	// 	console.error(e.stack);
	// 	res.status(500);
	// });
	// for (i=0;i<list_iid.length;i++){
	// 	pool.query("INSERT INTO Items (IID, LID) VALUES ($1 $2)",[list_iid[i],lid])
	// }
}

module.exports = {
	db_pool: pool,
	get_user: get_user_by_uuid,
	get_list: get_list_by_lid,
	create_new_list: create_list
}