const {Pool} = require('pg');

const pool = new Pool();

function query() {
	pool.query("SELECT * FROM Users WHERE username='scashin0';", (error, results) => {
    	if (error) {
       	 	throw error;
    	}
    		console.log(results.rows);
	});
}

module.exports.fcn = query;
