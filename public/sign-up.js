function main() {
    document.querySelector('#confirmar').addEventListener('click', cadastrar)

    function cadastrar(){
        let nome   = (document.querySelector('#nome').value).trim()
        let email  = (document.querySelector('#email').value).trim()
        let senha  = (document.querySelector('#senha').value).trim()
        let senha2 = (document.querySelector('#senha2').value).trim()
        let loader = document.querySelector('.lds-facebook')
        
        if(nome.length == 0 || email.length == 0 || senha.length == 0 || senha2.length == 0 ) {
            alert('preecha todos os campos')
        }   else {
            if (senha !== senha2) {
                alert('senhas incompatíveis')
            } else {
                loader.style.visibility = "visible"
                firebase.auth().createUserWithEmailAndPassword(email, senha)
                    .then(() =>{
                        firebase.auth().onAuthStateChanged( async (user) => {
                           await firebase.database().ref(`users/${user.uid}/dados`).set({nome: nome, email: email, senha: senha})
                                localStorage.clear()
                                localStorage.setItem('uid', JSON.stringify(user.uid))
                                window.location.href = 'payment.html'
          
                        })
                    })
                    .catch((error) => {
                        loader.style.visibility = "hidden"
                        if(error){
                            alert(error.code)
                        }
                    })
                }
            }
        }

}

main()