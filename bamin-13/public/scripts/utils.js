function validateId(id) {
  // 4~20자, 영소문자, 숫자, 특수기호(_,-)
  if(id.length < 4 || id.length > 20) return false;
  return /^([a-z0-9-_]+)$/.test(id)
}
function validateName(name){
  // 특수문자, 숫자는 사용 불가능
  return /^([a-zA-Z가-힣]+)$/.test(name)
}
function validatePassword(password){
  // 영문+숫자, 8~20자
  if(password.length < 8 || password.length > 20) return false;
  return /^([A-Za-z0-9]+)$/.test(password)
}

function validatePasswordChk(password,passwordChk){
  if(password!==passwordChk)return false;
  else return true;
}



/*
console.log(validateId('1231dDSFSDF'))
console.log(validateId('1231-123'))
console.log(validateId('name1_d3'))

console.log(validateName('김철수'))
console.log(validateName('곤잘라스'))
console.log(validateName('곤잘라스as'))

console.log(validatePassword('abas'))
console.log(validatePassword('abadfdSDFs'))

console.log(validatePassword('abad1234fdSDFs'))
console.log(validatePassword('abad123-fdSDFs'))
*/