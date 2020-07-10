const authBtn=document.getElementById('auth-btn');
const modal=document.querySelector('.modal-container');
const closeModalBtn=document.getElementById('close-modal-btn')
const modalOverlay=document.querySelector('.modal-overlay');

const openModal=()=>{
    // console.log('open');
    modal.classList.remove('hidden');
}

const closeModal=()=>{
    // console.log('close');
    modal.classList.add('hidden');
}

authBtn.addEventListener('click',openModal);
closeModalBtn.addEventListener('click',closeModal);
modalOverlay.addEventListener('click',closeModal);
