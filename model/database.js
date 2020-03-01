const { Pool } = require('pg');
const uuidv1 = require('uuid/v1');

const pool = new Pool();


function getUserByUuid(uuid) {
    return pool.query('SELECT * FROM Users WHERE UUID=$1;', [uuid]);
}

function setUser(uuid, user) {
    pool.query('UPDATE users SET name=$1, email=$2, homelocation=$3 WHERE UUID=$4;', [user.name, user.email, user.homelocation, uuid]);
}


function getItem(iid) {
    return pool.query('SELECT * FROM Items WHERE IID=$1;', [iid]);
}

function getItems(lid) {
    return pool.query('SELECT * FROM Items WHERE LID=$1;', [lid]);
}

async function readableLists(uuid) {
    return pool.query("SELECT LID FROM Auth Where UUID=$1 and Permission&b'0100'='0100'", [uuid]);
}

async function authenticate(lid, uuid) {
<<<<<<< HEAD
    return pool.query('SELECT Permission FROM Auth WHERE LID=$1 AND UUID=$2;', [lid, uuid]).then((response) => response.rows);
=======
    return pool.query("SELECT Permission FROM Auth WHERE LID=$1 AND UUID=$2;",[lid, uuid]).then(response => response.rows);
>>>>>>> a283c58230a4f3f80fc981e3ec9385233a67dec0
}

function checkRead(permissionArray) {
    return ((permissionArray.length > 0) && permissionArray[0].permission[1] === '1');
}

function checkWrite(permissionArray) {
    return ((permissionArray.length > 0) && permissionArray[0].permission[2] === '1');
}

function checkModify(permissionArray) {
    return ((permissionArray.length > 0) && permissionArray[0].permission[3] === '1');
}

function checkAdmin(permissionArray) {
    return ((permissionArray.length > 0) && permissionArray[0].permission[0] === '1');
}

function getListByLid(response, lid) {
    pool.query('SELECT * FROM Lists WHERE LID=$1;', [lid]).then((ret) => {
        if (ret.rows) {
            response.status(200).json(ret.rows[0]);
        } else {
            response.status(404);
        }
    }).catch(() => {
        response.status(500);
    });
}


function createList(response, uuid, lid, lname, rbg) {
    // insert the new lists into Lists
    const currentDate = new Date();
    // currentDate upon creation creates the current date
    // which can be used to determine its modification date
    pool.query('INSERT INTO Lists (LID, listname, Colour, Modified) VALUES ($1, $2, $3, $4);', [lid, lname, rbg, currentDate]).then(() => {
        response.status(200).json();
    }).catch((e) => {
        console.error(e.stack);
        response.status(500);
    });
}

<<<<<<< HEAD
function addPermission(uuid, lid, permission) {
    // insert the new list's user's permissions into Auth
    // as this only occurs when the user is creating a list, they are the admin
    // so they have full permissions
    return pool.query('INSERT INTO Auth (UUID, LID, Permission) VALUES ($1, $2, CAST($3 AS BIT(4))) RETURNING *', [uuid, lid, permission]);
=======
function add_permission(uuid, lid,permission) {
	// insert the new list's user's permissions into Auth
	// as this only occurs when the user is creating a list, they are the admin
	// so they have full permissions
	return pool.query("INSERT INTO Auth (UUID, LID, Permission) VALUES ($1, $2, CAST($3 AS BIT(4))) RETURNING *",[uuid,lid,permission]);
>>>>>>> a283c58230a4f3f80fc981e3ec9385233a67dec0
}

function addItem(body) {
    // insert the new list's user's permissions into Auth
    // as this only occurs when the user is creating a list, they are the admin
    // so they have full permissions
    const submit = body;
    submit.Modified = new Date();
    submit.Completed = false;
    const parameters = [uuidv1(), submit.UUID, submit.LID,
        submit.Name, submit.Completed, submit.Modified];
    return pool.query('INSERT INTO Items (IID, UUID, LID, Name, Completed, Modified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', parameters);
}

function setCompleted(iid, Completed) {
    return pool.query('UPDATE Items Set Completed=$2 WHERE IID=$1', [iid, Completed]);
}

function checkCompleted(iid) {
    return pool.query('SELECT Completed FROM Items Where Iid=$1', [iid]);
}

module.exports = {
    db_pool: pool,
    get_user: getUserByUuid,
    set_user: setUser,
    get_item: getItem,
    authenticate_list: authenticate,
    can_read: checkRead,
    can_write: checkWrite,
    can_modify: checkModify,
    is_admin: checkAdmin,
    check_completed: checkCompleted,
    set_completed: setCompleted,
    readable_lists: readableLists,
    get_list: getListByLid,
    create_new_list: createList,
    create_admin: addPermission,
<<<<<<< HEAD
    add_user: addPermission,
=======
    add_user: add_permission,
>>>>>>> a283c58230a4f3f80fc981e3ec9385233a67dec0
    add_item: addItem,
    get_items: getItems,
};
