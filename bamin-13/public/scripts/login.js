
const storage = window.localStorage;

const savedId = storage.getItem('id')
if(savedId){
    elements['id'].value = savedId;
}

async function submit(){
    if(await validateForms()){
        const idChecked = elements['id-chkbox'].checked
        if(idChecked){
            storage.setItem('id', elements['id'].value)
        }
        else {
            storage.setItem('id', '')
        }
        form.submit();    
    }
}
const loginButton = elements['login-btn']
loginButton.addEventListener('click', submit);