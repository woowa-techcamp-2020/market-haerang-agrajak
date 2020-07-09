const checkList = ['id', 'password', 'name','password-chk'];

const formElement = document.querySelector('form');

// 인증 버튼 클릭시 모달 관련 변수들
const authBtn = document.getElementById('phone-auth-btn');
const openPostalButton = document.querySelector('#address-btn')
const numberInputText = document.querySelector('#auth-number-input');
const numberAlert = document.getElementById('number-alert');
const blueBtn=document.querySelectorAll('.item-2-btn');
const modal = document.querySelector('.modal-container');
const closeModalBtn = document.getElementById('close-modal-btn')
const modalOverlay = document.querySelector('.modal-overlay');


//주소 찾기
const addressBtn=document.querySelector('#address-btn');
const addressCheckBox = document.getElementById('select-info-chk')
const codeBox = document.querySelector('#code-box');

// 약관 동의
const essentialCheckBox = document.getElementById('essential-info-chk')
const termsAgreeCheckBox = document.getElementById('terms-agree-chk')
const advertiseCheckBox = document.getElementById('advertise-info-chk')


//우편 번호 찾기 기능 
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


// 주소 선택 여부 따른 입력 가능/불가 기능 
function setAddressBoxEnabled(value){

    if(value){
        addressBtn.classList.remove('item-2-btn');
        addressBtn.classList.add('blue-btn');
    }else{
        addressBtn.classList.add('item-2-btn');
        addressBtn.classList.remove('blue-btn');
    }

    const addressBox = document.getElementById('postcode-box')
    addressBox.childNodes.forEach(node=>{
        node.disabled=!value;
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

// 전체 약관 동의 기능 
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
        if(!alertElement.classList.contains('visible')){
            alertElement.classList.add('visible');
        }
        if(!actualElement.classList.contains('red-box')){
            actualElement.classList.add('red-box');
        }
    }
    else {
        // 유효성 검사에 성공했다면 경고문을 숨기고 빨간 테두리 표시를 없애준다.
        if(alertElement.classList.contains('visible')){
            alertElement.classList.remove('visible');
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
        numberAlert.innerText='입력시간을 초과하였습니다'
    }
}


function requestAuthCode(){
    //todo: 인증이 완료되었을 경우에는 그냥 리턴하는 함수
    // if(true){
    //     //remove eventlistener
    //     return;
    // }
    const http = new XMLHttpRequest();
    const phone = document.getElementById('phone').value;
    if(!http) return;
    http.onload = function(){
        if(http.status === 200 || http.status == 201){
            const {authCode, invalidAt} = JSON.parse(http.responseText)['data']
            openModal(authCode); //모달 열기
            countFinishedAt = invalidAt;
        }
    };
    http.open('POST', '/api/phone-auth');
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(JSON.stringify({phone}));
}

// 인증번호 생성 관련 모달 함수

authBtn.addEventListener('click', requestAuthCode);

const openModal=(value)=>{
    modal.classList.remove('hidden');
    document.getElementById('modal-auth-code').innerText = value;
}

const closeModal=()=>{
    modal.classList.add('hidden');
    codeBox.classList.remove('hidden');
    numberAlert.classList.remove('hidden');
    numberInputText.classList.add('red-box');
    blueBtn.forEach(v=>{
        if(!v.classList.contains('address-btn')){
            v.classList.remove('item-2-btn');
            v.classList.add('blue-btn');
            authBtn.value='재전송';
        }
    })
    renderCountDown()
}

closeModalBtn.addEventListener('click',closeModal);
modalOverlay.addEventListener('click',closeModal);


// 파란색 버튼 클릭시 원래 스타일로 돌아옴 

// blueBtn.forEach(v=>{
//     if(!v.classList.contains('address-btn')){
//         v.classList.remove('item-2-btn');
//         v.classList.add('blue-btn');
//         authBtn.value='재전송';
//     }
// })



// todo: 인증번호 확인 후 메세지, 버튼 

function authComplete(){
    if(true){// true 대신 인증번호 확인하는 함수 필요

        blueBtn.forEach(v=>{
            v.addEventListener('click',()=>{
                v.classList.remove('blue-btn');
                v.classList.add('item-2-btn');
            })
        })

    }

}
authComplete();