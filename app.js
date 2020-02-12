let express = require('express');
let helmet = require('helmet')
let morgan = require('morgan')
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

var app = express();

// view engine setup

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(process.env.PORT, () => console.log("App listening on port "+process.env.PORT));
