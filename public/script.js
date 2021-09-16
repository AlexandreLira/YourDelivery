
function main() {
    
    function horaAtual(){
        let time   = new Date()
        let hora   = ('00' + time.getHours()).slice(-2)
        let minuto = ('00' + time.getMinutes()).slice(-2)

        return {hora: hora, minuto: minuto}
    }

    function dataAtual(){
        let data = new Date()
        if(horaAtual().hora >=0 && horaAtual().hora <=5) {
            data.setDate(data.getDay(), data.getMonth(), data.getFullYear())
        }
        let ano = data.getFullYear()
        let mes = data.getMonth()+1
        let dia = data.getDate()
        let diaDaSemana = data.getDay()
        
        return {dia: dia, mes: mes, ano: ano, diaDaSemana: diaDaSemana}
    }

    async function pegarEntregasCadastradas(){
        await firebase.database().ref(`users/${userUid}/dados/entregas`).once('value', (snapshot) => {
            snapshot.forEach(ChildItem => {
                entregas.push(
                    {
                        nome: ChildItem.key, 
                        valorRecebido: ChildItem.val().valorRecebido, 
                        valorRepassado: ChildItem.val().valorRepassado
                    })
            })
            firebase.database().ref(`users/${userUid}`)
        })
        criarDivEntregas(entregas)
    }    

    function criarDivEntregas(entregas){
        let divInputs = document.querySelector('#div-input-values')

        if(entregas.length > 6) {
            divInputs.style.justifyContent =  'unset'
        } else {
            divInputs.style.justifyContent =  'space-evenly'   
        }



        for(let entrega of entregas) {
           

            divInputs.innerHTML += `
            <div>
                <input type="number" min="0" class="input-value" id="a${entrega.nome}">
                <p>${entrega.nome}</p>
                <p>${entrega.valorRepassado}</p>
                <p class="value" id="p${entrega.nome}">R$0.00</p>
            </div>
            `
        }
    }

    async function pegarNomeDoDelivery() {
        let companie = ''

        if(localStorage.getItem('nome') == null) {
            await firebase.database().ref(`users/${userUid}`).once('value', (snapshot) => {
                snapshot.forEach(ChildItem => {
                    if (ChildItem.key == 'dados'){
                        companie = ChildItem.val().nome
                        
                        }
                    })
                }) 
            } 
            else {
                companie = JSON.parse(localStorage.getItem('nome'))

            }
            localStorage.setItem('nome', JSON.stringify(companie))
            document.querySelector('#nomeDaEmpresa').innerHTML = companie
            document.querySelector('#fotoPerfil').innerHTML = companie[0]
        

    }

    async function mostraNomesNoInput(){
        let dataList = document.querySelector('#div-input-name #motoqueiros')
        dataList.innerHTML = ''
        motoqueiros = []
        
        await firebase.database().ref(`users/${userUid}/motoqueiros`).once('value', (snapshot) => {
            snapshot.forEach(ChildItem => {
                motoqueiros.push({nome: ChildItem.key})
            });
        })

        for(let motoqueiro of motoqueiros) {
            dataList.innerHTML += `
                <option value="${motoqueiro.nome}" ></option>
            `
        }
        Motoqueiros = motoqueiros
    }

    // colocar os dados de pagamento no banco de dados
    function pagarMotoqueiro(valorTotalRecebido, valorTotalRepassado, entrega){
        let data = dataAtual()
        let hora = horaAtual()
        let nome = document.querySelector('#input-name').value
        let semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"]

        firebase.database().ref(`users/${userUid}/motoqueiros/${nome}/${data.ano}/${data.mes}/${data.dia}`)
        .set({
            valorRecebido: valorTotalRecebido,
            valorRepassado: valorTotalRepassado,
            diaDaSemana: semana[data.diaDaSemana],
            entregas: entrega,
            horario: `${hora.hora}:${hora.minuto}` 
        })
    }

    function nota(){
        let SectionToPrint = document.querySelector('#section-to-print')

        let inputNome = document.querySelector('#input-name').value
        let nome      = document.querySelector('#section-to-print .name')
        let entregas  = document.querySelector('#section-to-print #entregasTotalNota')
        let valor     = document.querySelector('#section-to-print #valorTotalNota')
        printRenderEntregas()

        nome.innerHTML     = inputNome
        entregas.innerHTML = totalEntregas
        valor.innerHTML    = `R$${totalValor}`
        print(SectionToPrint.innerHTML)

     }

    function printRenderEntregas(){
        lista = document.querySelector('#section-to-print #listaEntregas')
        lista.innerHTML = ''

        for(let entrega of entregasFeitas) {
            lista.innerHTML += `
            <li>

                ----------------------------------------------------<br>
                <div style="display: flex;">
                    <p style="width: 116.6px">${entrega.nomeDaEntrega}</p>
                    
                    <div style="display: flex; justify-content: center; width: 116.6px;">
                        <p>${entrega.entregas}</p>
                    </div>
                    <div style="display: flex; justify-content: flex-end; width: 116.6px;">
                        <p>R$${entrega.valorRepassado}</p>
                    </div>
                </div>
            </li>
            `
        }

    }


    function calcular(){

        let valorTotalRepassado = 0
        let valorTotalRecebido  = 0
        let totalDeEntregas     = 0

        entregasFeitas = []

        for(entrega of entregas) {
            let input = Number(document.querySelector(`#a${entrega.nome}`).value)
            let valorTotal = (input * entrega.valorRepassado).toFixed(2)

            valorTotalRecebido += (input * entrega.valorRecebido)
            valorTotalRepassado += Number(valorTotal)

            if(input != 0) {
                document.querySelector(`#p${entrega.nome}`).innerHTML = `R$${valorTotal}`
                totalDeEntregas += input
                entregasFeitas.push({nomeDaEntrega: entrega.nome, valorRepassado: valorTotal, entregas: input})
            }
            
        }   

        valorTotalRepassado = valorTotalRepassado.toFixed(2) 
        valorTotalRecebido  = valorTotalRecebido.toFixed(2)

        document.querySelector('#div-allvalue .valorTotal').innerHTML = `R$${valorTotalRepassado}`
        document.querySelector('#div-allvalue .totalEntregas').innerHTML = totalDeEntregas

        totalEntregas = 0
        totalValor    = 0

        totalEntregas = totalDeEntregas
        totalValor    = valorTotalRepassado

        pagarMotoqueiro(valorTotalRecebido, valorTotalRepassado, totalDeEntregas)
        nota()
    }

    function verificar(){
        let nome = document.querySelector('#input-name').value
        let motoqueiroCadastrado = false
        for (motoqueiro of Motoqueiros) {
            if(motoqueiro.nome == nome) {
                motoqueiroCadastrado = true
            }
        }
        if (motoqueiroCadastrado == false) {
            alert('Motoqueiro não cadastrado')
         } else {
             calcular()
         }
    }

    

   
    
    let userUid = JSON.parse(localStorage.getItem('uid'))
    let entregas = []
    let entregasFeitas = []
    let Motoqueiros = []

    let totalEntregas = 0
    let totalValor    = 0
    
    
    document.querySelector('#button-calcular').addEventListener('click', verificar)
    
    
    
    


    pegarNomeDoDelivery()
    pegarEntregasCadastradas()
    mostraNomesNoInput()
}
main()

// ================  SOFTWARE DEVELOPER: Alexandre Lira =================================
// ======================== Teste em produçao ===========================================
// ========================== vesion: 3.5.0  ============================================