const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const indexRouter = require('./routes/index');
const itemsRouter = require('./routes/items');
const usersRouter = require('./routes/users');
const listsRouter = require('./routes/lists');
const authRouter = require('./routes/auth');
const locationRouter = require('./routes/location');

const app = express();

PORT = process.env.PORT || 3000;

MAPBOX_ACCESS_TOKEN = process.env.mapbox;

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/items', itemsRouter);
app.use('/lists', listsRouter);
app.use('/auth', authRouter);
app.use('/location', locationRouter);


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
