# ServerSide
Repository for the serverside of the project
# Setup
1. clone the git repository
2. run npm install
3. psql -f model/sql_scripts/schema.sql
4. load dummy data from model/sql_scripts/Users.sql
4. set up the environment variables
    export PGUSER='csc492_yourlist';
    export PGHOST='mcsdb.utm.utoronto.ca';
    export PGPASSWORD='';
    export PGDATABASE='csc492_yourlist';
    export PGPORT=5432;
    export PORT=30000;
    export mapbox="";
5. node app.js
