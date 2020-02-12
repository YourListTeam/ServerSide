const {Pool} = require('pg');

const pool = new Pool();

function get_user_by_uuid(uuid) {
	return pool.query("SELECT * FROM Users WHERE UUID=$1;",[uuid]);
}

function get_item(iid) {
    return pool.query("SELECT * FROM Items WHERE IID=$1;",[iid]);
}

function get_items(lid) {
    return pool.query("SELECT * FROM Items WHERE LID=$1;",[lid]);
}

function authenticate(lid, uuid) {
    pool.query("SELECT Permission FROM Auth WHERE LID=$1 AND UUID=$2;",[lid, uuid]).then((result) => {
        console.log(result);
    });
}

module.exports = {
	db_pool: pool,
    get_user: get_user_by_uuid,
    get_item: get_item,
    get_items: get_items,
    authenticate_list: authenticate,
}