
const storage = window.localStorage;

const savedId = storage.getItem('id')
if(savedId){
    elements['id'].value = savedId;
    elements['id-chkbox'].checked = true;
}
async function submit(){
    if(await validateForms()){
        const idChecked = elements['id-chkbox'].checked
        if(idChecked){
            storage.setItem('id', elements['id'].value)
        }
        else {
            storage.removeItem('id')
        }
        form.submit();
    }
}
elements['login-btn'].addEventListener('click', submit);
// 엔터키 눌렀을 때 submit!
form.addEventListener('keydown', (event)=>{
    if(event.keyCode == 13){
        submit();
    }
})