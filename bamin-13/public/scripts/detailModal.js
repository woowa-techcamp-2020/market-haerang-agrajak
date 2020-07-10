

function openDetailModal(value){
    document.querySelector('#detail-modal').classList.remove('hidden');
}

function closeDetailModal(){
    document.querySelector('#detail-modal').classList.add('hidden');

}

document.querySelector('#age-detail').addEventListener('click',openDetailModal);
document.querySelector('#close-detail-modal-btn').addEventListener('click',closeDetailModal);
modalOverlay.addEventListener('click',closeDetailModal);