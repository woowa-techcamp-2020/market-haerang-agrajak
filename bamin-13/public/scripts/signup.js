// 인증 버튼 클릭시 모달 관련 변수들

const openPostalButton = document.querySelector('#address-btn')
const numberInputText = document.querySelector('#auth-number-input');
const numberAlert = document.getElementById('number-alert');
const blueBtn = document.querySelectorAll('.item-2-btn');
const modal = document.querySelector('.modal-container');
const closeModalBtn = document.getElementById('close-modal-btn')
const modalOverlay = document.querySelector('.modal-overlay');

//주소 찾기
const addressBtn = elements['address-btn'];
const addressCheckBox = elements['select-info-chk']
const codeBox = document.getElementById('code-box');

// 약관 동의
const essentialCheckBox = elements['essential-info-chk']
const termsAgreeCheckBox = elements['terms-agree-chk']
const advertiseCheckBox = elements['advertise-info-chk']


//우편 번호 찾기 기능 
const postalBox = new daum.Postcode({
    oncomplete: function(data) {
        const {zonecode, address} = data;
        elements['postcode'].value = zonecode;
        elements['address'].value = address;
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

elements['signup-finish-btn'].addEventListener('click', submit)
function submit(){
    // TODO: validation 한번 더하기 (빈 칸 있으면 찾아내기) -> Focus 해주기
    if(validateForms())
        form.submit();
}
var countFinishedAt = 0;

function renderCountDown(){
    const timer = document.getElementById('auth-timer')
    let sec = parseInt((countFinishedAt - (+new Date())) / 1000);
    let min = String(parseInt(sec/60)+100).substr(1,2); 
    sec = String(sec%60+100).substr(1,2)
    timer.innerText = `${min}:${sec}`
    if(elements['auth-number-input'].getAttribute('authed')){
        document.getElementById('number-alert').innerText = '인증되었습니다'
    }
    else if(sec>0){
        setTimeout(renderCountDown, 500);
    }
    else {
        document.getElementById('number-alert').innerText = '입력시간을 초과하였습니다'
        timer.innerText = ''
    }
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
async function requestAuthCode(){
    //todo: 인증이 완료되었을 경우에는 그냥 리턴하는 함수
    // if(true){
    //     //remove eventlistener
    //     return;
    // }
    const {data} = await request('/api/phone-auth', 'POST', {phone: elements['phone'].value});
    const {authCode, invalidAt} = data
    openModal(authCode); //모달 열기
    countFinishedAt = invalidAt;
}
async function compareAuthCode(){
    const phone = elements['phone'].value
    const authCode = elements['auth-number-input'].value
    
    const data = await request(`/api/phone-auth?phone=${phone}&authCode=${authCode}`, 'GET');
    console.log(data)
    const {success, message} = data
    if(success){
        elements['auth-number-input'].setAttribute('authed', 'true');
    }
}

// 인증번호 생성 관련 모달 함수

elements['phone-auth-btn'].addEventListener('click', requestAuthCode);
elements['number-submit-btn'].addEventListener('click', compareAuthCode);

const openModal=(value)=>{
    modal.classList.remove('hidden');
    document.getElementById('modal-auth-code').innerText = value;
}

const closeModal=()=>{
    modal.classList.add('hidden');
    codeBox.classList.remove('hidden');
    validateQueue([elements['auth-number-input']])
    blueBtn.forEach(v=>{
        if(!v.classList.contains('address-btn')){
            v.classList.remove('item-2-btn');
            v.classList.add('blue-btn');
            elements['phone-auth-btn'].value='재전송';
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