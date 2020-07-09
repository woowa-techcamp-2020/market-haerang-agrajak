function validateId(id) {
  // 4~20자, 영소문자, 숫자, 특수기호(_,-)
  if(id.length < 4 || id.length > 20) return false;
  return /^([a-z0-9-_]+)$/.test(id)
}
async function validateDuplicateId(id) {
  const {success} = await request(`/api/users/${id}`, 'get');
  return success
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
function validatePasswordChk(password, passwordChk){
  if(password !== passwordChk) return false;
  return true;
}

function request(url, method, data) {
  return new Promise((resolve, reject)=>{
      const http = new XMLHttpRequest();
      if(!http) reject(new Error('No Http Object!'));
      http.open(method, url)
      if(method == 'post' || method == 'POST'){
          http.setRequestHeader('Content-Type', 'application/json');
      }
      http.onload = function(){
          if(http.status === 200 || http.status == 201){
              resolve(JSON.parse(http.responseText))
          }
          else{
              reject(JSON.parse(http.responseText))
          }
      };
  
      http.send(JSON.stringify(data))
  })
}

if(document.forms.length){
  var form = document.forms[0]
  var elements = form.elements  
  form.addEventListener('focusout', validateForms);
}


async function validateForms(event){
    if(event){
        // 이벤트에서 이 함수가 호출된 경우에는 큐에 이벤트 타겟 하나만 넣는다.
        return await validateQueue([event.target])
    }
    else {
        // 이벤트에서 이 함수가 호출된 경우에는 큐에 폼에 있는 모든 인풋을 넣는다.
        return await validateQueue([...elements])
    }
}

async function validateQueue(queue){
  // queue(배열)에 있는 요소들이 모두 조건에 부합하는가를 검사한다.
  for(const elem of queue){
      const alertTarget = elem.getAttribute('alert');
      // html에 alert attribute가 있는 htmlElement만 검사한다.
      if(alertTarget){
          const alertElem = document.getElementById(alertTarget);
          const {validation, message} = await validate(elem);
          alertElem.classList.remove('success')
          if(!validation){
              elem.classList.add('red-box')
              alertElem.classList.remove('hidden')
              alertElem.innerText = message
              // 이벤트에서 불러오지 않았을 경우에만 focus를 한다.
              if(queue.length > 1){ 
                  elem.focus();
              }
              return false;
          }
          elem.classList.remove('red-box')
          if(message === ''){
            alertElem.classList.add('hidden')
            alertElem.innerText = ''  
          }
          else {
            alertElem.classList.remove('hidden')
            alertElem.classList.add('success')
            alertElem.innerText = message
          }
      }
  }
  return true;
}


async function validate(elem){
  const {value, id, checked = true} = elem;    
  let message = '';
  let ret = false;
  if(id === 'id'){
      if(value.length == 0) message = '아이디를 입력해주세요';
      else if(!validateId(value)) message = '아이디는 4-20자의 영소문자, 숫자, 특수기호(-, _)만 사용가능합니다.'
      else if(!await validateDuplicateId(value)) message = '이미 사용 중인 아이디 입니다.'
      else {
        ret = true;
        message = '사용 가능한 아이디입니다.'
      }
  }
  if(id == 'password'){
      if(value.length == 0) message = '비밀번호를 입력해주세요';
      else if(!validatePassword(value)) message = '비밀번호는 영문과 숫자를 포함하여 8~20자로 입력해주세요.'
  }
  if(id == 'password-chk'){
      if(value.length == 0) message = '확인 비밀번호를 입력해주세요';
      else if(!validatePasswordChk(value, elements['password'].value)) message = '비밀번호와 일치하지 않습니다. 다시 입력해주세요.'
  }
  if(id == 'email-front'){
      if(value.length == 0) message = '이메일 아이디를 입력해주세요';
  }
  if(id == 'email-back'){
    if(value.length == 0) message = '이메일 도메인을 입력해주세요';
  }
  if(id == 'name'){
    if(value.length == 0) message = '이름을 입력해주세요'
    else if(!validateName(value)) message = '이름은 영어와 한글만 사용가능합니다.'
  }
  if(id == 'phone'){
    if(value.length == 0) message = '핸드폰 번호를 입력해주세요'
    // TODO: validatePhone() 구현
  }
  if(id == 'auth-number-input'){
    if(value.length == 0) message = '인증번호를 입력해주세요.'
    else if(elem.getAttribute('authed') !== 'true'){
      message = "인증에 실패하였습니다. 재시도 해주세요."
    }
  }
  if(id == 'essential-info-chk'){
    if(!checked) message = '필수항목에는 체크를 하셔야합니다.'
  }
  return {
      validation: ret || message === '',
      message
  }
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