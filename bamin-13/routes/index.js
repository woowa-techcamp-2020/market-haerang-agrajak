const express = require('express');
const loginRouter = require('./login');
const signupRouter = require('./signup');
const completeRouter = require('./complete');
const router = express.Router();
router.use('/login', loginRouter);
router.use('/signup', signupRouter);
router.use('/complete', completeRouter);

router.get('/', function(req, res, next) {  
  const {user} = req.session;
  
  if(user === undefined){
    res.render('main');
  }
  else{
    res.render('logged', {id: user.id, name: user.name});
  }
});

module.exports = router;
