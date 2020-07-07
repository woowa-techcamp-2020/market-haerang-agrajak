
const formElement = document.querySelector('form')
const checkList = ['id', 'password', 'name']

formElement.addEventListener('focusout', (event)=>{
    const {target} = event
    if(checkList.includes(target.id)){
        let validation = true;
        switch(target.id){
            case 'id': 
            validation = validateId(target.value);
            break;            
            case 'password': 
            validation = validatePassword(target.value);
            break;            
            case 'name': 
            validation = validateName(target.value);
            break;            
            default: 
            break;            
        }
        const alertElement = document.getElementById(target.id+'-alert')
        if(!validation){
            if(!alertElement.classList.contains('is-visible')){
                alertElement.classList.add('is-visible')
            }
        }
        else {
            if(alertElement.classList.contains('is-visible')){
                alertElement.classList.remove('is-visible')
            }
        }
    }
})