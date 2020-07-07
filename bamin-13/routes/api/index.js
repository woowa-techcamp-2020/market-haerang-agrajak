const express = require('express');
const router = express.Router();

const usersApiRouter = require('./users');
const phoneAuthApiRouter = require('./phone-auth');

router.use('/users', usersApiRouter);
router.use('/phone-auth', phoneAuthApiRouter);

module.exports = router;
