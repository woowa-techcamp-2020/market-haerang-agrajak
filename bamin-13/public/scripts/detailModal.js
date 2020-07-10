

const openModal2=(value)=>{
    modal.classList.remove('hidden');
    document.querySelector('.modal-content').innerHTML=
    `
    <div style="text-align:left">
    <p style="padding:10px">
    정보통신망 이용촉진 및 정보보호 등에 관한 법률에서는 만 14세 미만 아동의 개인정보 수집 시 법정대리인 동의를 받도록 규정하고 있으며, 만 14세 미만 아동이 법정대리인 동의없이 회원가입을 하는 경우 회원탈퇴 또는 서비스 이용이 제한 될 수 있습니다.</p></div>
    <input id="close-modal-btn" value="확인" />
    `
}

const closeModal2=()=>{
    modal.classList.add('hidden');

}

document.querySelector('#age-detail').addEventListener('click',openModal2);
document.querySelector('#close-modal-btn').addEventListener('click',closeModal2);
modalOverlay.addEventListener('click',closeModal2);