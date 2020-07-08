const checkList = ['id', 'password', 'name','password-chk'];

const formElement = document.querySelector('form');
const modal = document.querySelector('.modal-container');
const closeModalBtn = document.getElementById('close-modal-btn')
const modalOverlay = document.querySelector('.modal-overlay');
const authBtn = document.getElementById('auth-btn');
const openPostalButton = document.querySelector('#address-btn')
const codeBox = document.querySelector('#code-box');
const numberInputText = document.querySelector('#auth-number-input');
const numberAlert = document.getElementById('number-alert');
const addressCheckBox = document.getElementById('select-info-chk')
const essentialCheckBox = document.getElementById('essential-info-chk')
const termsAgreeCheckBox = document.getElementById('terms-agree-chk')
const advertiseCheckBox = document.getElementById('advertise-info-chk')
const postalBox = new daum.Postcode({
    oncomplete: function(data) {
        const {zonecode, address} = data;
        document.getElementById('postcode').value = zonecode;
        document.getElementById('address').value = address;
    }
})

openPostalButton.addEventListener('click', ()=>{
    postalBox.open();
})

function setAddressBoxEnabled(value){
    const addressBox = document.getElementById('postcode-box')
    addressBox.childNodes.forEach(node=>{
        node.childNodes.forEach(elem=>{
            elem.disabled = !value
        })
    })
}

setAddressBoxEnabled(false);
addressCheckBox.addEventListener('input', (event)=>{
    const {checked} = event.target
    setAddressBoxEnabled(checked);
})
termsAgreeCheckBox.addEventListener('input', (event)=>{
    const {checked} = event.target
    essentialCheckBox.checked = checked
    advertiseCheckBox.checked = checked
})

// 이벤트 위임 
// 텍스트 입력창에서 벗어날 때 유효성 검사 조건에 맞지 않으면 경고문 보여준다
formElement.addEventListener('focusout', (event)=>{
    const {target} = event;
    // 현재의 타겟이 id, password, name 중에 하나라면 
    let validation = true;
    if(checkList.includes(target.id)){
        // 유효성 검사
        if(target.id === 'id'){
            validation = validateId(target.value);
        }else if(target.id === 'password'){
            validation = validatePassword(target.value);
        }else if(target.id === 'name') {
            validation = validateName(target.value);
        }else if(target.id === 'password-chk'){
            const passwd = document.getElementById('password').value;
            validation = validatePasswordChk(passwd,target.value);
        }
    }
    else return;

    // 유효성 검사 결과에 따라 경고창 css를 설정해 줄 클래스를 추가 혹은 삭제한다
    const actualElement=document.getElementById(target.id);
    const alertElement = document.getElementById(target.id+'-alert');
    if(!validation){
        // 만약 유효성 검사에 실패했다면 경고문을 보여주고 빨간 테투리 표시를 해준다
        if(!alertElement.classList.contains('is-visible')){
            alertElement.classList.add('is-visible');
        }
        if(!actualElement.classList.contains('red-box')){
            actualElement.classList.add('red-box');
        }
    }
    else {
        // 유효성 검사에 성공했다면 경고문을 숨기고 빨간 테두리 표시를 없애준다.
        if(alertElement.classList.contains('is-visible')){
            alertElement.classList.remove('is-visible');
        }
        if(actualElement.classList.contains('red-box')){
            actualElement.classList.remove('red-box');
        }
    }
})

function submit(){
    // TODO: validation 한번 더하기 (빈 칸 있으면 찾아내기) -> Focus 해주기
    formElement.submit();
}
var countFinishedAt = 0;

function renderCountDown(){
    const timer = document.getElementById('auth-timer')
    let sec = parseInt((countFinishedAt - (+new Date())) / 1000);
    let min = String(parseInt(sec/60)+100).substr(1,2); 
    sec = String(sec%60+100).substr(1,2)
    timer.innerText = `${min}:${sec}`
    if(sec>0){
        setTimeout(renderCountDown, 500);
    }
    else {
        timer.innerText = ''
    }
}


function requestAuthCode(){
    const http = new XMLHttpRequest();
    const phone = document.getElementById('phone').value;
    if(!http) return;
    http.onload = function(){
        if(http.status === 200 || http.status == 201){
            const {authCode, invalidAt} = JSON.parse(http.responseText)['data']
            openModal(authCode);
            countFinishedAt = invalidAt;
        }
    };
    http.open('POST', '/api/phone-auth');
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(JSON.stringify({phone}));
}
authBtn.addEventListener('click', requestAuthCode);

const openModal=(value)=>{
    modal.classList.remove('hidden');
    document.getElementById('modal-auth-code').innerText = value;
}

const closeModal=()=>{
    modal.classList.add('hidden');
    codeBox.classList.remove('hidden');
    numberAlert.classList.add('is-visible');
    numberInputText.classList.add('red-box');
    renderCountDown()
}

//authBtn.addEventListener('click',openModal);
closeModalBtn.addEventListener('click',closeModal);
modalOverlay.addEventListener('click',closeModal);
