const express = require('express');
const router = express.Router();
const User = require('../models/user');

router
  .get('/', (req, res, next) => {
    User.findById(req.user.id)
      .select('username')
      .lean()
      .then(user => res.send(user))
      .catch(next);
  });

module.exports = router;
