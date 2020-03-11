const { Pool } = require('pg');
const uuidv1 = require('uuid/v1');

const pool = new Pool();


function getUserByUuid(uuid) {
    return pool.query('SELECT * FROM Users WHERE UUID=$1;', [uuid]);
}

function setUser(uuid, user) {
    return pool.query('UPDATE users SET Name=$1, Email=$2, HomeLocation=$3 WHERE UUID=$4;', [user.Name, user.Email, user.HomeLocation, uuid]);
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
    return pool.query('SELECT Permission FROM Auth WHERE LID=$1 AND UUID=$2;', [lid, uuid]).then((response) => response.rows);
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

function getListByLid(lid) {
    return pool.query('SELECT * FROM Lists WHERE LID=$1;', [lid]);
}


function createList(lid, lname, rbg) {
    // insert the new lists into Lists
    const currentDate = new Date();
    // currentDate upon creation creates the current date
    // which can be used to determine its modification date
    return pool.query('INSERT INTO Lists (LID, listname, Colour, Modified) VALUES ($1, $2, $3, $4);', [lid, lname, rbg, currentDate]);
}

function addPermission(uuid, lid, permission) {
    // insert the new list's user's permissions into Auth
    // as this only occurs when the user is creating a list, they are the admin
    // so they have full permissions
    let b_str = (permission >>> 0).toString(2);
    return pool.query('INSERT INTO Auth (UUID, LID, Permission) VALUES ($1, $2, $3) RETURNING *', [uuid, lid, b_str]);
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

function userInList(uuid, lid) {
    // returns true if user has permissions for specified list
    return pool.query('SELECT * FROM Auth WHERE UUID = $1 AND LID = $2;', [uuid, lid]);
}

function deleteUser(uuid, lid) {
    // contact must be previously added to the list
    return pool.query('DELETE FROM Auth WHERE UUID = $1 AND LID = $2 RETURNING *;', [uuid, lid]);
}

function locationExists(lid, long,lat) {
    // returns true if user has permissions for specified list
    return pool.query('SELECT * FROM Locations WHERE LID = $1 AND Address ~= POINT($2,$3);', [lid, long,lat]);
    // should one list have only one location
    // return pool.query('SELECT * FROM Locations WHERE LID = $1;', [lid]);
}

function createLocation(lid, long,lat) {
    // returns true if user has permissions for specified list
    return pool.query('INSERT INTO Locations (LID, Address) VALUES ($1, POINT($2,$3)) RETURNING *;', [lid, long,lat]);
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
    delete_contact: deleteUser,
    user_in_list: userInList,
    add_user: addPermission,
    add_item: addItem,
    get_items: getItems,
    check_location: locationExists,
    create_location: createLocation
};
