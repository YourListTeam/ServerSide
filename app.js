var express = require('express');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var listsRouter = require('./routes/lists');
var authRouter = require('./routes/auth');

var app = express();

PORT = process.env.PORT || 3000


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/lists', listsRouter);
app.use('/auth', authRouter);


app.listen(PORT, () => console.log("App listening on port "+PORT));
