
const formElement = document.querySelector('form');
const checkList = ['id', 'password', 'name','password-chk'];

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