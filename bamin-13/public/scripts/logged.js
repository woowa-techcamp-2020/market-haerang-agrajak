window.onload = function(){
    const logOutBtn = document.getElementById('logout')
    logOutBtn.addEventListener('click', async ()=>{
        await request('/api/users/logout', 'get');
        location.href = '/'
    })
}
