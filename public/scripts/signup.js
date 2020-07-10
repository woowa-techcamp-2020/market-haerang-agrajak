// 인증 버튼 클릭시 모달 관련 변수들

const blueBtn = document.querySelectorAll('.item-2-btn');
const modal = document.querySelector('.modal-container');
const closeModalBtn = document.getElementById('close-modal-btn')
const modalOverlay = document.querySelector('.modal-overlay');
const numberAlert=document.querySelector('#number-alert')

//주소 찾기
const codeBox = document.getElementById('code-box');

//우편 번호 찾기 기능 
const postalBox = new daum.Postcode({
    oncomplete: function(data) {
        const {zonecode, address} = data;
        elements['postcode'].value = zonecode;
        elements['address'].value = address;
    }
})

elements['address-btn'].addEventListener('click', ()=>{
    postalBox.open();
    elements['address-btn'].classList.remove('blue-btn');
    elements['address-btn'].classList.add('item-2-btn');
})

// 주소 선택 여부 따른 입력 가능/불가 기능 
function setAddressBoxEnabled(value){
    const addressBtn = elements['address-btn']
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
elements['select-info-chk'].addEventListener('input', (event)=>{
    const {checked} = event.target
    setAddressBoxEnabled(checked);
})

// 전체 약관 동의 기능 
elements['terms-agree-chk'].addEventListener('input', (event)=>{
    const {checked} = event.target
    elements['essential-info-chk'].checked = checked
    elements['advertise-info-chk'].checked = checked
})


// 가입 완료 버튼 눌렀을 때 
elements['signup-finish-btn'].addEventListener('click', submit)
async function submit(){
    // TODO: validation 한번 더하기 (빈 칸 있으면 찾아내기) -> Focus 해주기
    if(await validateForms()){
        elements['email-back'].removeAttribute('disabled')
        form.submit();

    }
}
var countFinishedAt = 0;

function renderCountDown(){
    const timer = document.getElementById('auth-timer')
    let sec = parseInt((countFinishedAt - (+new Date())) / 1000);
    let min = String(parseInt(sec/60)+100).substr(1,2); 
    sec = String(sec%60+100).substr(1,2)
    timer.innerText = `${min}:${sec}`
    numberAlert.classList.remove('success')
    if(elements['auth-number-input'].getAttribute('authed') === 'true'){
        numberAlert.innerText = '인증되었습니다'
        numberAlert.classList.add('success')
        timer.innerText=''
        elements['auth-number-input'].classList.remove('red-box');
        elements['phone-auth-btn'].classList.remove('blue-btn');
        elements['phone-auth-btn'].classList.add('item-2-btn');
        elements['number-submit-btn'].classList.remove('blue-btn');
        elements['number-submit-btn'].classList.add('item-2-btn');
        
    }
    else if(sec>0){
        setTimeout(renderCountDown, 500);
    }
    else {
        numberAlert.innerText = '입력시간을 초과하였습니다'
        timer.innerText = ''
    }
}

// 이메일 선택기
const emailSelector = document.getElementById('email-select-container');
emailSelector.addEventListener('input', (event)=>{
    const {value} = event.target
    const emailBackElem = elements['email-back'];
    if(value === ''){
        emailBackElem.removeAttribute('disabled');
        emailBackElem.value = '';
    }
    else{
        emailBackElem.setAttribute('disabled', 'true');
        emailBackElem.value = (value === 'select') ? '' : value;
    }
})
async function requestAuthCode(){
    const {data} = await request('/api/phone-auth', 'POST', {phone: elements['phone'].value});
    elements['auth-number-input'].setAttribute('authed', 'pending')
    const {authCode, invalidAt} = data
    openModal(authCode);
    countFinishedAt = invalidAt;
}

function openModal(value){
    modal.classList.remove('hidden');
    document.getElementById('modal-auth-code').innerText = value;
    elements['auth-number-input'].removeAttribute('authed');
}

closeModalBtn.addEventListener('click',closeModal);
modalOverlay.addEventListener('click',closeModal);

function closeModal(){
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

async function compareAuthCode(){
    const phone = elements['phone'].value
    const authCode = elements['auth-number-input'].value
    
    const data = await request(`/api/phone-auth?phone=${phone}&authCode=${authCode}`, 'GET');
    const {success, message} = data
    if(success){
        elements['auth-number-input'].setAttribute('authed', 'true');
    }
    else {
        elements['auth-number-input'].setAttribute('authed', 'false');
    }
}

// 인증번호 생성 관련 모달 함수
elements['phone-auth-btn'].addEventListener('click', requestAuthCode);
elements['number-submit-btn'].addEventListener('click', compareAuthCode);


