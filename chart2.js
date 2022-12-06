//my data
const vs24mRate = 102.1427
/////////////////////////////////////////////////////////////
//Chart
/////////////////////////////////////////////////////////////
//setup
const dataChart2 = {//labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
        label: '24M FWD rates dynamics',
        //data: [85, 115, 145, 130, 65],
        backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
            'rgba(54, 162, 235, 1)',
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
            label: '24M FWD rate as of 10 Jan 2022',
            data: [vs24mRate],
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
const config2 = {
    type: 'line',
    data: dataChart2,
    plugins: [ChartDataLabels],
    options: {
        //add horizontal level of rate for copmarison
        plugins: {
            autocolors: false,
            title: {
                display: true,
                text: '24M FWD rates',
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
                        yMin: vs24mRate,
                        yMax: vs24mRate,
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
// render
const myChart2 = new Chart(
    document.getElementById('myChart2'),
    config2
)

/////////////////////////////////////////////////////////////
//update of Chart with fetched data
/////////////////////////////////////////////////////////////
let hoistedValue2 = 0  // chart update with new fetched data
// let month2 = []
// let value2 = []
const histData24m = {
    "2022-01-14": 108.1083,
    "2022-01-17": 105.9409,
    "2022-01-24": 107.4361,
    "2022-01-28": 106.4676,
    "2022-01-31": 105.826,
    "2022-02-01": 105.8205,
    "2022-02-14": 110.312,
    "2022-02-18": 106.2326,
    "2022-02-22": 117.2486
}

let month2 = Object.keys(histData24m)  //["2022-01-14", "2022-01-17","2022-01-24","2022-01-28","2022-01-31","2022-02-01","2022-02-14"]
let value2 = Object.values(histData24m) // [108.1083,105.9409, 107.4361, 106.4676, 105.826, 105.8205, 110.312]

//Get data from data24m.json
// function getHistData24m(){
//     async function historicalData() {
//         const url = 'https://co71783.tmweb.ru/data24m.json'
//         const response = await fetch(url)
//         const histData24m = await response.json()
//         return histData24m
//     }
//     historicalData().then(histData24m => {
//         month2 = Object.keys(histData24m)
//         value2 = Object.values(histData24m)
//     })
// }

//Add today's point
function updateChart2(){
    async function fetchData() {
        const url = 'https://www.db-markets.com/api/forward?tenors=ON&tenors=24M&ccyPairs=EUR_RUB&swapPoints=false'
        const response = await fetch(url)
        const datapoints = await response.json()
//        console.log(datapoints) //TBDdeleted
        return datapoints
    }

    //get the values or from fetch response (equals to ask value)
    fetchData().then(datapoints => {

        const monthGet = ((arr) => {
            arr.push(datapoints.data[0].tenors[1].valueDate)
            return arr
        })
        let finMonth = monthGet(month2)
//        console.log(month2) //TBDdeleted

        const valueGet = ((arr) => {
            arr.push(datapoints.data[0].tenors[2].ask)
            return arr
        })
        let finValue = valueGet(value2)
//        console.log(finValue) //TBDdeleted

        // deletion of fisrt values of the chart if more than 31 values
        if(myChart2.data.labels.length > 31) {
            myChart2.data.labels.shift()
            myChart2.data.datasets[0].data.shift()
        }

        myChart2.data.labels = finMonth
        myChart2.data.datasets[0].data = finValue

        myChart2.update()
        hoistedValue2++
    })
}

//setInterval(updateChart, 10000)  // 86400000 - 1 day
