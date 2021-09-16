function main(){
    let uid = JSON.parse(localStorage.getItem('uid'))
    if(uid == null) {
        window.location.href = 'index.html'
    } 
}
main()