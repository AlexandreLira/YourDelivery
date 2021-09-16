
document.querySelector('#entrar').addEventListener('click', entrar)
    async function entrar(){
        let email = (document.querySelector('#input-email').value).trim()
        let senha = (document.querySelector('#input-password').value).trim()
        let loader = document.querySelector('.lds-facebook')

       


        if(email.length == 0 || senha.length == 0) {
            alert('preecha todos os campos')
        } else {

            loader.style.visibility = "visible"
            await  firebase.auth().signInWithEmailAndPassword(email, senha)
            .then(() => {
                
                firebase.auth().onAuthStateChanged((user) => {
                    localStorage.clear()
                    localStorage.setItem('uid', JSON.stringify(user.uid))

                    window.location.href = 'payment.html'
                })
            })
            .catch((error) => {
                loader.style.visibility = "hidden"
                if(error.code == "auth/user-not-found" || error.code == "auth/wrong-password") {
                    alert('Email ou senha incorreto')
                }
                else {
                    alert(error.code)
                }
                
            })
            
        }




    }

