const express = require('express');
const loginRouter = require('./login');
const signupRouter = require('./signup');
const completeRouter = require('./complete');
const WoowaDB = require('../modules/woowadb')
const router = express.Router();
const woowaDB = new WoowaDB();
router.use('/login', loginRouter);
router.use('/signup', signupRouter);
router.use('/complete', completeRouter);

router.get('/', function(req, res, next) {  
  const {id} = req.session;
  if(id === undefined){
    res.render('main');
  }
  else{
    const user = woowaDB.findUser(id);
    res.render('logged', {id, name: user.name});
  }
});

module.exports = router;
