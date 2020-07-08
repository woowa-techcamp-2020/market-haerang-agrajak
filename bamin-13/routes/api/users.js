const express = require('express');
const router = express.Router();
const {success, fail} = require('../../modules/utils')
const MSG = require('../../modules/responseMessage')
const WoowaDB = require('../../modules/woowadb');
const { response } = require('express');
const woowaDB = new WoowaDB()

router.post('/login', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  const {id, name, password, emailFront, emailBack, phone, authNumber, postalCode, address, detailAddress} = req.body;
  const email = emailFront+'@'+emailBack;
  let errMessage = ''
  try{
    // TODO: validate id, name, password and etc..
    // TODO: check authNumber
    if(woowaDB.findUser(id)){
      res.render('error', {message: MSG.ALREADY_ID})
      return;
    }
    woowaDB.addUser({id, name, password, email, phone, postalCode, address, detailAddress})
  }
  catch(error){
    res.render('error', {message: errMessage, error});
  }
  res.render('complete', {id, name, email, phone})
});

router.get('/:id', function(req, res){
  if(woowaDB.findUser(id)){
    res.send(fail(200, MSG.ALREADY_ID));
  }
  else
    res.send(success(200, MSG.AVAILABLE_ID))
})
module.exports = router;
