import React from 'react'
import Grid from '@material-ui/core/Grid'
import { Map, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function RideView(props) {
    const [lat, setLat]= React.useState(51.505)
    const [lng, setLng]= React.useState(-.09)
    const [zoom, setZoom] = React.useState(13)
    const {name = 'Ride', duration = '00h12mm42ss', summary = '', data = ''} = props

    return(
        <Grid direction='column' container>
            <Grid item>
                <h1>{name}</h1>
            </Grid>
            <Grid item>
                <Map style={{height: '300px', width:'auto'}}center={[lat, lng]} zoom={zoom}>
                    <TileLayer
                        attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </Map>
            </Grid> 
        </Grid>
    )
}

export default RideView