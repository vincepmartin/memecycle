import React from 'react'
import Grid from '@material-ui/core/Grid'
import { Map, TileLayer, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'


// Convert the long/lat to numbers we can use.
function getLongLatFloat(records) {
    console.log(records)
    return (records.filter(r => {
        if(r.position_lat && r.position_long)
            return r
        }).map(d => [parseFloat(d.position_lat), parseFloat(d.position_long)]))
}

// Find center for map placement.
function getCenter(records) {
    const minmax_lat =  [Math.min(...records.map(d => d[0])), Math.max(...records.map(d => d[0]))];
    const minmax_long = [Math.min(...records.map(d => d[1])), Math.max(...records.map(d => d[1]))];

    // Do some math and sheeeit to figure out the middle point between the min/max lat and long.
    return [(minmax_lat[0] + minmax_lat[1]) / 2, (minmax_long[0] + minmax_long[1]) / 2]
}

function RideView({rideID}) {
    const [zoom, setZoom] = React.useState(13)
    const [download, setDownload] = React.useState({ loaded: false, error: null })
    const [title, setTitle] = React.useState()
    const [description, setDescription] = React.useState()
    const [rideData, setRideData] = React.useState()


    React.useEffect(() => {
        fetch(`http://localhost:8080/rides/${rideID}`)
            .then(response => {
                return(response.json())
            })
            .then(ride => {
                // Get the title.
                setTitle(ride.title)

                // Get description.
                setDescription(ride.description)

                // Set ride data.
                setRideData(JSON.parse(ride.rideData))
                
                // Set download status
                setDownload({loaded: true, error: null})  
            }).catch(error => {
                setDownload({loaded: false, error: error})
            })            
        }, [])

    return(
        <Grid direction='column' container>
            <Grid item>
                <h1>{title}</h1>
            </Grid>

            <Grid item>
                {download.error && <h3>{download.error}</h3>} 
                {download.loaded && 
                    <Map style={{height: '300px', width:'auto'}} 
                        center={getCenter(getLongLatFloat(rideData.records))}
                        zoom={zoom}
                        bounds={getLongLatFloat(rideData.records)}
                        >
                        
                        <TileLayer
                            attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Polyline positions = {getLongLatFloat(rideData.records)}></Polyline>
                    </Map>
                }
            </Grid> 
            
            {rideData && 
                <Grid container direction="row" justify="center" alignItems="center" spacing={5}>
                        <Grid item><h5>Distance: {rideData.sessions[0].total_distance}</h5></Grid>
                        <Grid item><h5>Feet Climbed: {rideData.sessions[0].total_ascent*1000}</h5></Grid>
                        <Grid item><h5>Feet Descended: {rideData.sessions[0].total_descent*1000}</h5></Grid>
                </Grid>
            }

            <Grid item>
                <p>{description}</p>
            </Grid>
        </Grid>
    )
}

export default RideView