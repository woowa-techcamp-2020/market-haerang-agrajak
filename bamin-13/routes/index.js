const express = require('express');
const loginRouter = require('./login');
const signupRouter = require('./signup');
const completeRouter = require('./complete');

const router = express.Router();

router.use('/login', loginRouter);
router.use('/signup', signupRouter);
router.use('/complete', completeRouter);

router.get('/', function(req, res, next) {  
  res.render('main');
});


module.exports = router;
