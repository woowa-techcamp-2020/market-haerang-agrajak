class User {
    constructor(obj){
        const {id, name, password, email, postalCode, address1, address2, phoneNumber} = obj;
        this.id = id
        this.name = name
        this.password = password
        this.email = email
        this.postalCode = postalCode
        this.address1 = address1
        this.address2 = address2
        this.phoneNumber = phoneNumber
    }
    validate(){
        // TODO: validate id, name, password
        return true
    }
}