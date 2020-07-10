

const openDetailModal=(value)=>{
    document.querySelector('#detail-modal').classList.remove('hidden');
}

const closeDetailModal=()=>{
    document.querySelector('#detail-modal').classList.add('hidden');

}

document.querySelector('#age-detail').addEventListener('click',openDetailModal);
document.querySelector('#close-detail-modal-btn').addEventListener('click',closeDetailModal);
modalOverlay.addEventListener('click',closeDetailModal);