const express = require('express');
const router = express.Router();

const usersApiRouter = require('./users');
const phoneAuthApiRouter = require('./phone-auth');

router.use('/users', usersApiRouter);
router.use('/phone-auth', phoneAuthApiRouter);

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
