import React from 'react'
import Grid from '@material-ui/core/Grid'
function RideListItem(props) {
    const { name, distance, duration } = props 

    return(
        <Grid item>
            <h2>{name}</h2>
            <p>Distance: {distance} miles</p> 
            <p>Time: {duration}</p>
        </Grid>    
    )
}

function RideList(props) {
    const rides = [
        {name: 'Ride 1', distance: '200', duration: '4h2m0s'},
        {name: 'Ride 2', distance: '123', duration: '3h1m0s'},
        {name: 'Ride 3', distance: '25', duration: '2h22m0s'},
        {name: 'Ride 4', distance: '87', duration: '2h2m0s'},
    ]

    return(
        <Grid direction='column' container>
            {rides.map((ride) => 
                <RideListItem
                    name={ride.name}
                    duration={ride.duration}
                    distance={ride.distance} 
                />
            )}
        </Grid>
    )
}

export default RideList