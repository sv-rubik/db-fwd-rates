//import month from "./data"
// const fs = require('fs')
// let month = require('./data')
//my data
const vs12mRate = 93.94
/////////////////////////////////////////////////////////////
//Chart
/////////////////////////////////////////////////////////////
// setup
const dataChart1 = {//labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
        label: '12M FWD rates dynamics',
        //data: [85, 115, 145, 130, 65],
        backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
            'rgb(54,162,235)',
        ],
        fill: false,
        borderWidth: 3,
        tension: 0.4,
        datalabels: {
            color: '#323334',
            formatter: function (value) {
                return parseFloat(value).toFixed(4)
            },
            font: {
                //weight: 'bold',
                size: 11,
            },
            display: 'auto',
            align: 'bottom',
            offset: '15'
        }
    },
        {
            label: '12M FWD rate as of 10 Jan 2022',
            data: [vs12mRate],
            backgroundColor: [
                'rgba(238,144,144)',
            ],
            borderColor: [
                'rgba(190,4,4)',
            ],
            fill: false,
            borderWidth: 3,
            //tension: 0.1
            datalabels: {
                display: false,
            }
        }]
}

// config
const config = {
    type: 'line',
    data: dataChart1,
    plugins: [ChartDataLabels],
    options: {
        //add horizontal level of rate for copmarison
        plugins: {
            autocolors: false,
            title: {
                display: true,
                text: '12M FWD rates',
                font:  {
                    size: 14,
                    weight: 'bold',
                    //family: "'Helvetica', sans-serif",
                },
                color: '#1e577e',
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: vs12mRate,
                        yMax: vs12mRate,
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 2,
                    }
                }
            },

        },
        scales: {
            y: {
                beginAtZero: false,
                suggestedMin: 80,
            }
        }
    },
}
// render / init
const myChart = new Chart(
    document.getElementById('myChart'),
    config
)

/////////////////////////////////////////////////////////////
//update of Chart with fetched data
/////////////////////////////////////////////////////////////
let hoistedValue = 0  // chart update with new fetched data
// let month = []
// let value = []
const histData12m = {
    "2022-01-14": 98.0097,
    "2022-01-17": 96.5679,
    "2022-01-24": 97.7772,
    "2022-01-28": 96.6338,
    "2022-01-31": 96.3970,
    "2022-02-01": 96.4903,
    "2022-02-14": 98.529,
    "2022-02-18": 96.6885,
    "2022-02-22": 104.0298
}
let month = Object.keys(histData12m)  //["2022-01-14", "2022-01-17","2022-01-24","2022-01-28","2022-01-31","2022-02-01","2022-02-14"]
let value = Object.values(histData12m) // [98.0097, 96.5679, 97.7772, 96.6338, 96.397, 96.4903, 98.529]

//Get data from data12m.json
// function getHistData12m(){
//     async function historicalData() {
//         const url = 'https://co71783.tmweb.ru/data12m.json'
//         const response = await fetch(url)
//         const histData12m = await response.json()
//         return histData12m
//     }
//     historicalData().then(histData12m => {
//         month = Object.keys(histData12m)
//         value = Object.values(histData12m)
//     })
// }

//Add today's point
function updateChart(){
    async function fetchData() {
        const url = 'https://www.db-markets.com/api/forward?tenors=ON&tenors=12M&ccyPairs=EUR_RUB&swapPoints=false'
        const response = await fetch(url)
        const datapoints = await response.json()
//      console.log(datapoints) //TBDdeleted
        return datapoints
    }

    //get the values or from fetch response (equals to ask value)
    fetchData().then(datapoints => {
        const monthGet = ((arr) => {
            arr.push(datapoints.data[0].tenors[1].valueDate)
            return arr
        })
        let finMonth = monthGet(month)
//        console.log(month) //TBDdeleted

        const valueGet = ((arr) => {
            arr.push(datapoints.data[0].tenors[2].ask)
            return arr
        })
        let finValue = valueGet(value)
//        console.log(finValue) //TBDdeleted

        //deletion of first values of the chart if more than 31 values
        if(myChart.data.labels.length > 31) {
            myChart.data.labels.shift()
            myChart.data.datasets[0].data.shift()
        }

        myChart.data.labels = finMonth
        myChart.data.datasets[0].data = finValue

        myChart.update()
        hoistedValue++
    })
}

//setInterval(updateChart, 30000)  // 86400000 - 1 day
