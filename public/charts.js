function main() {
    function dataAtual(){
        let data = new Date()
        
        let ano = data.getFullYear()
        let mes = data.getMonth()+1
        let dia = data.getDate()
        let diaDaSemana = data.getDay()
        
        return {dia: dia, mes: mes, ano: ano, diaDaSemana: diaDaSemana}
    }

    async function pegarReceita(){
        let motoqueiros = []
        let Receita = 0
        let Despesa = 0
        let Lucro   = 0
        let entregas = []
        let data = dataAtual()
        
        
        await firebase.database().ref(`users/${userUid}/motoqueiros`).once('value', (snapshot) => {
            snapshot.forEach(ChildItem => {
                motoqueiros.push(ChildItem.key)
            })
        })
        for (motoqueiro of motoqueiros) {
            firebase.database().ref(`users/${userUid}/motoqueiros/${motoqueiro}/${data.ano}/${data.mes}`).once('value', (snapshot) => {
                snapshot.forEach(ChildItem => {
                    
                    if(!entregas.includes(Number(ChildItem.key))) {
                        
                        entregas.push(Number(ChildItem.key))
                       
                        
                        
                    }
                    
                    Receita += Number(ChildItem.val().valorRecebido)
                    Despesa += Number(ChildItem.val().valorRepassado)
                    Lucro   = Receita - Despesa
    
                    document.querySelector('#receita').innerHTML = `R$${Receita.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.')}`
                    document.querySelector('#despesa').innerHTML = `R$${Despesa.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.')}`
                    document.querySelector('#lucro').innerHTML   = `R$${Lucro.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.')}`
                })
                
            })
          
        }
        
    }

    

    function chartEntregas(dias) {
        var ctx = document.getElementById('myChart')
        var myChart = new Chart(ctx, {
            type: 'line',
            
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    lineTension: 0,
                    label: 'Entregas',
                    data: [1,5,4,6,3,8,10],
                    backgroundColor: "rgba(83, 33, 191,.5)",
                    borderColor: "#5321BF"
                }]
            },

            
        });
            
    }
        
    function colocarNomeDelivery(){
        let nome = JSON.parse(localStorage.getItem('nome'))
        document.querySelector('#nomeDaEmpresa').innerHTML = nome
        document.querySelector('#fotoPerfil').innerHTML = nome[0]
    }

    
    function chartFaturamento() {
        var ctx = document.getElementById('myChart2')
        var myChart = new Chart(ctx, {
            type: 'line',

            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7'],
                datasets: [
                    {
                        label: 'Despesa',
                        data: [0, 10, 5, 2, 20, 28, 45],
                        backgroundColor: "rgba(255, 5, 12,.7)",
                        borderColor: "#FF050C"
                    },
                    {
                        label: 'Receita',
                        data: [5, 15, 12, 7, 10, 35, 50],
                        backgroundColor: "rgba(4, 255, 69,.5)",
                        borderColor: "#28FF92"
                    },
                ]
            },

            
        });
    }


    function a(){
        var ctx = document.getElementById('myChart3');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: '#0CDCF5',
 
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    
        
        
    
    
    
    let userUid = JSON.parse(localStorage.getItem('uid'))
    
    pegarReceita()
    chartEntregas()
    chartFaturamento()
    colocarNomeDelivery()
    a()
    

    
}
main()