
const ctx3 = document.getElementById('myChart3').getContext('2d');

const dataChart3 = {
    //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
        label: 'FWD rates as of today',
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
                return parseFloat(value).toFixed(2)
            },
            font: {
                //weight: 'bold',
                size: 11,
            },
            display: 'auto',
            align: 'top',
            offset: '15',
        },
    },
        {
            label: 'FWD rates as of 10/01/2022',
            data: [
                85.318, 85.3415, 85.4717, 85.6274, 85.9798, 86.5936, 87.3023, 87.9976, 88.8045, 89.4839, 91.7247, 93.9395, 98.8566, 102.1427, 109.6909, 116.9382, 124.1379
            ],
            backgroundColor: [
                'rgb(238,144,144)',
            ],
            borderColor: [
                'rgb(190,4,4)',
            ],
            fill: false,
            borderWidth: 3,
            tension: 0.4,
            datalabels: {
                color: '#323334',
                formatter: function (value) {
                    return parseFloat(value).toFixed(2)
                },
                font: {
                    //weight: 'bold',
                    size: 11,
                },
                display: 'auto',
                align: 'bottom',
                offset: '15'
            },
        },
    ]
}

const myChart3 = new Chart(ctx3, {
    type: 'line',
    plugins: [ChartDataLabels],
    data: dataChart3,
    options: {
        plugins: {
            title: {
                display: true,
                text: 'FWD rates as of today',
                font:  {
                    size: 14,
                    weight: 'bold',
                    //family: "'Helvetica', sans-serif",
                },
                color: '#1e577e',
            },
        },
        scales: {
            y: {
                beginAtZero: false,
                suggestedMin: 70,

            }
        }
    }
});

let hoistedValue3 = 0

function updateChart3(){
    async function fetchData() {
        const url = 'https://www.db-markets.com/api/forward?tenors=ON&tenors=12M&tenors=24M&tenors=1W&tenors=2M&tenors=5M&tenors=2W&tenors=1M&tenors=3M&tenors=4M&tenors=6M&tenors=9M&tenors=18M&tenors=36M&tenors=48M&tenors=60M&ccyPairs=EUR_RUB&swapPoints=false'
        const response = await fetch(url)
        const datapoints = await response.json()
        return datapoints
    }

    //get the values or from fetch response (equals to ask value)
    fetchData().then(datapoints => {
        const month = datapoints.data[0].tenors.map((month, index) => {
            return month.label
        })

        const value = datapoints.data[0].tenors.map((value, index) => {
            return value.ask
        })

        myChart3.data.labels = month
        myChart3.data.datasets[0].data = value

        myChart3.data.labels.push(month[hoistedValue3])
        myChart3.data.datasets[0].data.push(value[hoistedValue3])

        if(myChart3.data.labels.length > 17) {
            myChart3.data.labels.pop()
            myChart3.data.datasets[0].data.pop()
        }

        myChart3.update()
        hoistedValue3++
    })
}

//setInterval(updateChart3, 10000) // 86400000 - 1 day