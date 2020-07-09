class User {
    constructor(obj){
        const {id, name, password,salt, email, postalCode, address, detailAddress, phone} = obj;
        this.id = id
        this.name = name
        this.password=password
        this.salt=salt
        this.email = email
        this.postalCode = postalCode
        this.address = address
        this.detailAddress = detailAddress
        this.phone = phone
    }
    validate(){
        // TODO: validate id, name, password
        return true
    }
}
module.exports = User