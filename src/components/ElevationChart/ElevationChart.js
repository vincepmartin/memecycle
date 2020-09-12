import React from 'react'
import {Line} from 'react-chartjs-2'

function ElevationChart(props) {
    const {elevationData, distanceData, width, height} = props
    const data = {
        labels: distanceData,
        datasets: [
          {
            label: 'Elevation',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: elevationData,
          }
        ]
    }

    return(
        <Line data={data} width={600} height={300} options={{responsive: true, maintainAspectRatio: false}}/>
    )
}

export default ElevationChart