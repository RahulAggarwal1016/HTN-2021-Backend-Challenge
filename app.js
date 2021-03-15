// app.js contains all the app's middlewares and hacker routes

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const middlewares = require('./middlewares');
const controllers = require('./controllers');

const app = express(); // initialize instance of express

// common app middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.disable('x-powered-by');

app.get('/', (req, res, next) => {
  res.status(200).send({
    message: 'Hack the North 2021 - Backend Challenge',
    author: 'Rahul Aggarwal',
  });
});

app.get('/users', controllers.getUsers);
app.get('/users/:id', controllers.getUser);
app.put('/users/:id', controllers.updateUser);
app.get('/skills', controllers.getSkills);

// middlewares for unknown routes and errors
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
