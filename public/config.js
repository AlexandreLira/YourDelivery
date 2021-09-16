function main() {
    
    function colocarNomeDelivery(){
        let nome = JSON.parse(localStorage.getItem('nome'))
        document.querySelector('#nomeDaEmpresa').innerHTML = nome
        document.querySelector('#fotoPerfil').innerHTML = nome[0]
    }



    async function vericarSeMotoqueiroEstaCadastrado(){
        let nome =  document.querySelector('#input-nomeMotoqueiro').value
        nome = nome.toLowerCase()
        let nomeCadastrado = false
        
        await firebase.database().ref(`users/${userUid}/motoqueiros`).once('value', (snapshot) => {
            snapshot.forEach(ChildItem => {
                if (nome == ChildItem.key) {
                    nomeCadastrado = true
                }
            })
        })
        
        if (nomeCadastrado == false) {
            cadastrarMotoqueiro()
        } else {
            alert('motoqueiro já cadastrado')
        }
    }

    function cadastrarMotoqueiro(){
        let nome =  document.querySelector('#input-nomeMotoqueiro').value
        nome = nome.toLowerCase()
        if(nome.length > 0) {
            firebase.database().ref(`users/${userUid}/motoqueiros/${nome.trim()}`).set(0)
        } 
        document.querySelector('#input-nomeMotoqueiro').value = ''
        renderMotoqueiros()
    }


    async function renderMotoqueiros(){
        let motoqueiros = []

        let ListaMotoqueiros = document.querySelector('#listaMotoqueiros')
        ListaMotoqueiros.innerHTML = ''

        await firebase.database().ref(`users/${userUid}/motoqueiros`).once('value', (snapshot) => {
            snapshot.forEach(ChildItem => {
                motoqueiros.push({nome: ChildItem.key})
            });
        })

        for (motoqueiro of motoqueiros) {
            ListaMotoqueiros.innerHTML += `
                <li id="Motoqueiro"><p><strong>Nome:</strong> ${motoqueiro.nome}</p></li>
            `

        }
    }

    function cadastrarEntrega(){
        let nome              = document.querySelector('#box-cadastro #nome').value
        let valorDaEntrega    = Number(document.querySelector('#box-cadastro #valorDaEntrega').value).toFixed(2)
        let PagoAoMotoqueiro  = Number(document.querySelector('#box-cadastro #pagoAoMotoqueiro').value).toFixed(2)
        
        nome = nome.trim()
        nome = nome.toLowerCase()


        if(nome.includes('.') || nome.includes(',') || nome.includes(' ')) {
            alert('nome da entrega não pode conter caracteres especiais')
        } else {
            
            if(nome.length !== 0) {
                firebase.database().ref(`users/${userUid}/dados/entregas/${nome}`)
                .set(
                    {
                        nome: nome, 
                        valorRecebido: valorDaEntrega,
                        valorRepassado: PagoAoMotoqueiro,
                    })
            }
        }


        document.querySelector('#box-cadastro #nome').value              = ''
        document.querySelector('#box-cadastro #valorDaEntrega').value    = ''
        document.querySelector('#box-cadastro #pagoAoMotoqueiro').value  = ''

        renderEntregas()
        


    }
    
    async function renderEntregas(){
        let entregas = []

        let ListaEntregas = document.querySelector('#listaDeEntregas')
        ListaEntregas.innerHTML = ''

        await firebase.database().ref(`users/${userUid}/dados/entregas`).once('value', (snapshot) => {
            snapshot.forEach(ChildItem => {
                entregas.push(
                    {
                        nome: ChildItem.key, 
                        valorRecebido: ChildItem.val().valorRecebido,
                        valorRepassado: ChildItem.val().valorRepassado
                    })
                
            });
        })

        for (entrega of entregas) {
            let valorTotal = (entrega.valorRecebido - entrega.valorRepassado).toFixed(2)
            let cor = '#08C931'

            if(valorTotal < 0) {
                cor = '#C9081F'
            }


            ListaEntregas.innerHTML += `
                <li id="entrega">
                    <div id="alinharTextos">
                        <strong>Entrega :</strong><p> ${entrega.nome}</p>
                    </div>
                    <p>-----------------------------------------</p>
                    <div id="alinharTextos">
                        <strong>Valor da entrega: </strong><p>R$${Number(entrega.valorRecebido).toFixed(2)}</p>
                    </div>

                    <div id="alinharTextos">
                        <strong>Valor pago:</strong> <p>R$${Number(entrega.valorRepassado).toFixed(2)}</p>
                    </div>
                    <p>-----------------------------------------</p>
                    <div id="alinharTextos">
                        <strong>Lucro:</strong> <strong style="color: ${cor};">R$${valorTotal}</strong>
                    </div>

                    <button>Editar</button>
                </li>
            `

        }
    }

    



    let userUid = JSON.parse(localStorage.getItem('uid'))

    document.querySelector('#cadastrarMotoqueiro').addEventListener('click', vericarSeMotoqueiroEstaCadastrado)
    document.querySelector('#cadastrarEntrega').addEventListener('click', cadastrarEntrega)
    

    renderMotoqueiros()
    renderEntregas()
    colocarNomeDelivery()
}
main()