# YourList - Backend

This folder is the backend part of the YourList application! This contains most of the backend logic for working with lists, items and other users. This is a RESTful backend, with authentication based handled by Firebase on the client-side.  

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

#### Node.js

- ##### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- ##### Node installation on Ubuntu

  You can install node.js and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- ##### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.
```
$ node --version
v13.11.0

$ npm --version
6.13.7
```
If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.
```
$ npm install npm -g
```

### Installing

A step by step series of examples that tell you how to get a development env running

We are going to start by cloning the repository, then installing all of our dependencies
```
$ git clone https://github.com/UTMCSC301/project-yourlist.git
$ cd Serverside
$ npm i
```
Then we need to set up all of our environment variables. Create a file called config.env, and add in the following values.

```
export PGUSER=;
export PGHOST=;
export PGPASSWORD=;
export PGDATABASE=;
export PGPORT=;
export PORT=3000;
export UTORID=;
export mapbox=;
```

We are currently using PostgreSQL 9.5.21, although later versions should work as well. You can create a MapBox authentication token on the official [Mapbox Site](https://account.mapbox.com/). The UTORID variable is optional since it used by our setup script to create an SSH tunnel. You can then run `npm start` to start the application. If done correctly, you should see the following message be printed onto your terminal `App listening on port 3000`.

### And coding style tests

We utilize a slightly modified version of the airbnb-base eslint configuration. This can be run by using the following commands. 

```
$ npx eslint --fix .
```

## Deployment

We currently host our application on a University of Toronto Mississauga server, for this purpose we have created the deployment script, which can be run via the `deploy.sh` script. However, this also requires a slightly modified environment file. It is recommended for deployment to expand on the `deploy.sh` file. 

### Database

In order to set up the PostgreSQL database, the required scripts can be found in the [sql_scripts](model/sql_scripts/) folder. For loading the schema and dummy data, see the following commands. 

```
psql -f model/sql_scripts/schema.sql

psql -f model/sql_scripts/Users.sql
psql -f model/sql_scripts/Lists.sql
psql -f model/sql_scripts/Items.sql
```

It is recommended to use a tool like DataGrip which allows for automatic transactions and runs these scripts in bulk. 

## Built With

* [Node.js](https://nodejs.org/en/) - The backend interpreter for JavaScript
* [Express](https://expressjs.com/) - The routing for the API
* [PostgresSQL](https://www.postgresql.org/) - The DBMS used for this application
* [MapBox](https://www.mapbox.com/) - The API service used for reverse geocoding.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Krish Chowdhary** - *Mentor and PM* - [krishchow](https://github.com/krishchow)

* **Arthur Azarskyy** - *Front-End Lead* - [ArturAzarskyy](https://github.com/ArturAzarskyy)

* **Anshu Pandeya** - *Back-End Lead* - [anshu-p](https://github.com/anshu-p)

* **JP Moreno** - *Developer* - [jp-moreno](https://github.com/jp-moreno)

See also the list of [contributors](https://github.com/UTMCSC301/project-yourlist/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thank you to Sadia Sharmin and Ilir Dema for your support in making this project possible!
* Thank you, Andrew Wang, for all of your help in setting up the infrastructure for this project!
