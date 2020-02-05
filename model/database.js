const {Pool} = require('pg');

const pool = new Pool();

pool.query("SELECT * FROM Users WHERE username='scashin0';", (error, results) => {
    if (error) {
        throw error;
    }
    console.log(results.rows);
});
pool.end();