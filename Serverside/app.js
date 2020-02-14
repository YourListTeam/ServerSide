let express = require('express');
let helmet = require('helmet')
let morgan = require('morgan')
let indexRouter = require('./routes/index');
let itemsRouter = require('./routes/items');
let usersRouter = require('./routes/users');

var authRouter = require('./routes/auth');

var app = express();

// view engine setup

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/items', itemsRouter);
app.use('/lists', listsRouter);
app.use('/auth', authRouter);


app.listen(process.env.PORT, () => console.log("App listening on port "+process.env.PORT));
