const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler')();
const ensureAuth = require('./auth/ensure-auth')();

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('./public'));

const recipes = require('./routes/recipes');
const auth = require('./routes/auth');
const me = require('./routes/me');

app.use('/api/auth', auth);
app.use('/api/auth/me', ensureAuth, me);
app.use('/api/recipes', ensureAuth, recipes);
app.use(errorHandler);

module.exports = app;
