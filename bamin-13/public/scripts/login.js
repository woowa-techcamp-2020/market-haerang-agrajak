
const storage = window.localStorage;
const form = document.forms[0]
const elements = form.elements

const savedId = storage.getItem('id')
if(savedId){
    elements['id'].value = savedId;
}

form.addEventListener('focusout', validateForms);


function validateQueue(queue){
    // queue(배열)에 있는 요소들이 모두 조건에 부합하는가를 검사한다.
    for(const elem of queue){
        const alertTarget = elem.getAttribute('alert');
        // html에 alert attribute가 있는 htmlElement만 검사한다.
        if(alertTarget){
            const alertElem = document.getElementById(alertTarget);
            const {validation, message} = validate(elem);
            if(!validation){
                elem.classList.add('red')
                alertElem.classList.remove('hidden')
                alertElem.innerText = message
                // 이벤트에서 불러오지 않았을 경우에만 focus를 한다.
                if(!this.target){ 
                    elem.focus();
                }
                return false;
            }
            elem.classList.remove('red')
            alertElem.classList.add('hidden')
            alertElem.innerText = ''
        }
    }
    return true;
}
function validate(elem){
    const {value, id} = elem;    
    let message = '';

    if(id === 'id'){
        if(value.length == 0) message = '아이디를 입력해주세요';
        if(!validateId(value)) message = '유효한 아이디가 아닙니다.'
    }
    if(id == 'password'){
        if(value.length == 0) message = '비밀번호를 입력해주세요';
        if(!validatePassword(value)) message = '유효한 비밀번호가 아닙니다.'
    }
    return {
        validation: message === '',
        message
    }
}
function validateForms(event){
    if(event){
        // 이벤트에서 이 함수가 호출된 경우에는 큐에 이벤트 타겟 하나만 넣는다.
        return validateQueue([event.target])
    }
    else {
        // 이벤트에서 이 함수가 호출된 경우에는 큐에 폼에 있는 모든 인풋을 넣는다.
        return validateQueue([...elements])
    }
}
function submit(){
    if(validateForms()){
        const idChecked = elements['id-chkbox'].checked
        if(idChecked){
            storage.setItem('id', elements['id'].value)
        }
        else {
            storage.setItem('id', '')
        }
        form.submit();    
    }
}
const loginButton = elements['login-btn']
loginButton.addEventListener('click', submit);