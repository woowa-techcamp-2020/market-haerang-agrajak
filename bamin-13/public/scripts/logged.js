const { request } = require("../../app")

const logOutBtn = document.getElementById('logout')
logOutBtn.addEventListener('click', async ()=>{
    await request('/api/users/logout', 'get')
    location.href = '/'
})