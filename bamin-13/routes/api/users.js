const express = require('express');
const router = express.Router();
const {success, fail} = require('../../modules/utils')
const MSG = require('../../modules/responseMessages')
const WoowaDB = require('../../modules/woowadb');
const woowaDB = new WoowaDB()

router.post('/login', function(req, res, next) {
  const {id, password} = req.body;
  const user = woowaDB.findUser(id);
  // TODO: 비밀번호 해싱값 비교
  if(!user){
    res.render('error', {message: MSG.NO_USER});
  }
  else if(user.password === password){
    req.session.user = {
      id: user.id,
      name: user.name
    }
    res.redirect('/')
  }
  else{
    res.render('error', {message: MSG.LOGIN_FAIL + " " + MSG.MISMATCH_PW});
  }
});

router.get('/logout', function(req, res, next){
  req.session.user = undefined;
  res.send(success(200,''));
})
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
    // TODO: 해싱된 비밀번호 추가
    const hashedPassword = password;
    woowaDB.addUser({id, name, password: hashedPassword, email, phone, postalCode, address, detailAddress})
  }
  catch(error){
    res.render('error', {message: errMessage, error});
  }
  res.render('complete', {id, name, email, phone})
});

router.get('/:id', function(req, res){
  if(woowaDB.findUser(req.params.id)){
    res.send(fail(200, MSG.ALREADY_ID));
  }
  else
    res.send(success(200, MSG.AVAILABLE_ID))
})
module.exports = router;
