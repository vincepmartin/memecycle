import React from 'react'
import Grid from '@material-ui/core/Grid'
import { Map, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import rideFilePath from '../../rides/2020-06-27.fit'
const EasyFit = require('easy-fit/dist/easy-fit.js').default;

function RideView(props) {
    const [lat, setLat]= React.useState(51.505)
    const [lng, setLng]= React.useState(-.09)
    const [zoom, setZoom] = React.useState(13)

    const [rideData, setRideData] = React.useState(null)
    const [rideLoaded, setRideLoaded] = React.useState(false)
    const [error, setError] = React.useState(null)

    const {name = 'Ride', duration = '00h12mm42ss', summary = '', data = ''} = props
    console.log('****** MOUNTING COMPONENT *******')
    React.useEffect(() => {
        fetch(`http://localhost:3000/${rideFilePath}`)
            .then(response => {
                const easyFit = new EasyFit({
                    force: true,
                    speedUnit: 'mph',
                    lengthUnit: 'mi',
                    temperatureUnit: 'farhenheit'
                })
                
                debugger;
                easyFit.parse(response.body, (error, data) => {
                    if (error) {
                        console.log('*** PARSE ERROR:')
                        console.log(error)
                    } else {
                        console.log('*** Output from parse')
                        console.log(JSON.stringify(data))
                        debugger;
                    }
                })

                setRideData(response)
                setRideLoaded(true)
                setError(false)


            }).catch(error => {
                console.log('***: Error fetching file')
                console.log(error)
            })            
        }, [rideData])

/*
          })

    easyFit.parse(new Buffer(rideData), (error, data) => {
        if (error) {
            console.log('Error')
            console.log(error)
        } else {
            console.log(JSON.stringify(data))
        }
    })
*/
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
            <Grid item>
            
            </Grid>
        </Grid>
    )
}

export default RideView