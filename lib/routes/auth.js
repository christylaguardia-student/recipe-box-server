const express = require('express');
const router = express.Router();
const User = require('../models/user');

const ensureAuth = require('../auth/ensure-auth');
const tokenService = require('../auth/token-service');
const bodyParser = require('body-parser').json();

function hasRequiredEmailAndPassword(req, res, next) {
  const user = req.body;

  // QUESTION: should I require first & last name
  if (!user || !user.email || !user.password ) {
    return next({
      code: 400,
      error: 'Your first name, last name, email and password must be provided to sign up.'
    });
  }

  next();
}

router
  .get('/verify', ensureAuth, (req, res) => {
    res.send({ valid: true });
  })

  .post('/signup', bodyParser, hasRequiredEmailAndPassword, (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    delete req.body.password;

    User.exists({ email })
      .then(exists => {
        if (exists) { throw { code: 400, error: 'email already in use' }; }
        
        const user = new User({ firstName, lastName, email });
        user.generateHash(password);
        return user.save();
      })
      .then(user => tokenService.sign(user))
      .then(token => res.send({ token }))
      .catch(next);
  })

  .post('/signin', bodyParser, hasRequiredEmailAndPassword, (req, res, next) => {
    const { email, password } = req.body;
    delete req.body.password;

    User.findOne({ email })
      .then(user => {
        if (!user || !user.comparePassword(password)) {
          throw { code: 401, error: 'Invalid Login' };
        }
        return user;
      })
      .then(user => tokenService.sign(user))
      .then(token => res.send({ token }))
      .catch(next);
  });

module.exports = router;
