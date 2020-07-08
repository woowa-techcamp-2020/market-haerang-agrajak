const express = require('express');
const { success, fail } = require('../../modules/utils');
const MSG = require('../../modules/responseMessages');
const router = express.Router();
const phoneAuthMap = new Map();

function generateAuthCode(){
  let authCode = 0;
  while(authCode < 10e4 || authCode >= 10e6) authCode = Math.floor(Math.random()*10e5);
  return authCode;
}
router.get('/', function(req, res, next) {
  const {phone, authCode} = req.query;
  if(!phoneAuthMap.has(phone)){
    res.send(fail(200, MSG.AUTH_FAIL));
    return;
  }
  const {authCode: realAuthCode, invalidAt} = phoneAuthMap.get(phone)

  if(realAuthCode == authCode){
    if(invalidAt < +new Date()){
      res.send(fail(200, MSG.AUTH_INVALID));
      return;
    }
    res.send(success(200, MSG.AUTH_SUCCESS));
    return;
  }
  res.send(fail(200, MSG.AUTH_FAIL));
});
router.post('/', function(req, res, next) {
  const {phone} = req.body;
  const authCode = generateAuthCode();
  const invalidAt = +new Date() + 120000 // (millisecs)
  phoneAuthMap.set(phone, {
    authCode, invalidAt
  })
  res.send(success(200, MSG.AUTH_PUBLISHED, {authCode, invalidAt}));
});

module.exports = router;
