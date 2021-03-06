const { Pool } = require('pg');
const uuidv1 = require('uuid/v1');

const pool = new Pool();


function getUserByUuid(uuid) {
    return pool.query('SELECT * FROM Users WHERE UUID=$1;', [uuid]);
}

function setUser(uuid, user) {
    // change Name, Email and Homelocation for a given user
    return pool.query('UPDATE users SET Name=$1, Email=$2, HomeLocation=$3 WHERE UUID=$4;', [user.Name, user.Email, user.HomeLocation, uuid]);
}

function makeUser(parameters) {
    return pool.query('INSERT INTO users VALUES ($1, $2, $3, $4, $5, NULL) RETURNING *;', parameters);
}

function getItem(iid) {
    return pool.query('SELECT * FROM Items WHERE IID=$1;', [iid]);
}

function getItems(lid) {
    return pool.query('SELECT * FROM Items WHERE LID=$1;', [lid]);
}

async function readableLists(uuid) {
    // select lists for which the user ONLY has read permissions
    return pool.query("SELECT LID FROM Auth Where UUID=$1 and Permission&b'0100'='0100'", [uuid]);
}

async function authenticate(lid, uuid) {
    // validate the permission for a given user in a list
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

function getListLocByLid(lid) {
    return pool.query('SELECT lists.LID, lists.listname, lists.Colour, lists.modified, locations.Address, locations.AddressName, locations.Name FROM lists LEFT OUTER JOIN locations ON lists.LID=locations.LID WHERE lists.LID=$1', [lid]);
}

function createList(lid, lname, rbg) {
    // create a new list to be inserted into Lists
    const currentDate = new Date();
    // currentDate upon creation creates the current date
    // which can be used to determine its modification date
    return pool.query('INSERT INTO Lists (LID, listname, Colour, Modified) VALUES ($1, $2, $3, $4);', [lid, lname, rbg, currentDate]);
}

function addPermission(uuid, lid, permission) {
    // insert the new list's user's permissions into Auth
    // as this only occurs when the user is creating a list
    // user is the admin, so they have full permissions
    // eslint-disable-next-line no-bitwise
    const bStr = (permission >>> 0).toString(2);
    return pool.query('INSERT INTO Auth (UUID, LID, Permission) VALUES ($1, $2, $3) RETURNING *', [uuid, lid, bStr]);
}

function addItem(body) {
    const submit = body;
    // initialize an item for a list with the
    // creation date and incomplete status
    submit.Modified = new Date();
    submit.Completed = false;
    const parameters = [uuidv1(), submit.UUID, submit.LID,
        submit.Name, submit.Completed, submit.Modified];
    return pool.query('INSERT INTO Items (IID, UUID, LID, Name, Completed, Modified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', parameters);
}

function setCompleted(iid, Completed) {
    // item in list is checked off as 'completed'
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
    return pool.query('DELETE FROM Auth WHERE UUID = $1 AND LID = $2 RETURNING *;', [uuid, lid]);
}

function createLocation(lid, long, lat, name, address) {
    // returns true if user has permissions for specified list
    return pool.query('INSERT INTO Locations (LID, Address, Name, AddressName) VALUES ($1, POINT($2,$3), $4, $5) RETURNING *;', [lid, long, lat, name, address]);
}

function getLocation(lid) {
    // returns true if user has permissions for specified list
    return pool.query('SELECT * FROM Locations WHERE LID=$1;', [lid]);
}

function deleteList(lid) {
    // contact must be previously added to the list
    return pool.query('DELETE FROM Lists WHERE LID = $1 RETURNING *;', [lid]);
}

async function inList(uuid) {
    return pool.query('SELECT LID FROM Auth Where UUID=$1', [uuid]);
}

async function getListLocation(lid) {
    return pool.query('SELECT Address FROM Locations Where LID=$1;', [lid]);
}

function updateAuth(permission, uuid, lid) {
    // upate the current permission to the new one for a user in a list
    return pool.query('UPDATE Auth SET Permission=$1 WHERE UUID=$2 AND LID=$3;', [permission, uuid, lid]);
}

module.exports = {
    db_pool: pool,
    get_user: getUserByUuid,
    set_user: setUser,
    create_user: makeUser,
    get_item: getItem,
    authenticate_list: authenticate,
    can_read: checkRead,
    can_write: checkWrite,
    can_modify: checkModify,
    is_admin: checkAdmin,
    check_completed: checkCompleted,
    set_completed: setCompleted,
    readable_lists: readableLists,
    get_list: getListLocByLid,
    create_new_list: createList,
    delete_contact: deleteUser,
    user_in_list: userInList,
    add_user: addPermission,
    add_item: addItem,
    get_items: getItems,
    create_location: createLocation,
    delete_list: deleteList,
    get_location: getLocation,
    in_list: inList,
    get_list_location: getListLocation,
    update_auth: updateAuth,
};
