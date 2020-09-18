import React from 'react'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import { Map, TileLayer, Polyline, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import ElevationChart from '../ElevationChart/ElevationChart'
import {useLocation} from 'react-router'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    color: 'purple'
})

// Convert the long/lat to numbers we can use.
function getLongLatFloat(records) {
    return (records.filter(r => {
        if(r.position_lat && r.position_long)
            return r
        }).map(d => [parseFloat(d.position_lat), parseFloat(d.position_long)]))
}

// Get elevation and distance data.
function getElevationAtDistance(records) {
    return (records.filter(r => {
        if(r.altitude && r.distance)
            return r
        }).map(d => [parseFloat(d.distance).toFixed(1), getFeetFromMiles(parseFloat(d.altitude))]))
}

// Convert miles to feet.
function getFeetFromMiles(miles) {
    return (miles * 5280).toFixed(2)
}

// Find center for map placement.
function getCenter(records) {
    const minmax_lat =  [Math.min(...records.map(d => d[0])), Math.max(...records.map(d => d[0]))];
    const minmax_long = [Math.min(...records.map(d => d[1])), Math.max(...records.map(d => d[1]))];

    // Do some math and sheeeit to figure out the middle point between the min/max lat and long.
    return [(minmax_lat[0] + minmax_lat[1]) / 2, (minmax_long[0] + minmax_long[1]) / 2]
}

function formatDate(date) {
    const td = new Date(date)
    return (`${td.getMonth()}/${td.getDay()}/${td.getFullYear()} - ${td.toLocaleTimeString()}`)
}

// function RideView({rideID}) {

// Altering for use with react-router query params.
function RideView({match, location}) {
    const [zoom, setZoom] = React.useState(13)
    const [download, setDownload] = React.useState({ loaded: false, error: null })
    const [title, setTitle] = React.useState()
    const [description, setDescription] = React.useState()
    const [rideData, setRideData] = React.useState()
    const [photos, setPhotos] = React.useState([]) 
    const rideID = match.params.rideID
    
    // TODO: Come back and clean up the error handling. 
    // a. How do we figure out if we have a proper data response?  Check each one?
    // b. Do this all up front in bulk?
    
    // Load an image. 
    const Image = ({image}) => {
        const arrayBufferView = new Uint8Array(image.data.data)
        const blob = new Blob([arrayBufferView], {type: 'image/jpeg'})
        const urlCreator = window.URL || window.webkitURL
        const imageUrl = urlCreator.createObjectURL(blob)
        return(<img src={imageUrl}/>)
    }

    // On first load of the component go ahead and try to download the image.
    React.useEffect(() => {
        fetch(`http://localhost:8080/rides/${rideID}`)
            .then(response => {
                return(response.json())
            })
            .then(ride => {
                // Get the title.
                if(ride.title)
                    setTitle(ride.title)

                // Get description.
                if(ride.description) 
                    setDescription(ride.description)

                // Set ride data.
                if(ride.rideData)
                    setRideData(JSON.parse(ride.rideData))
               
                // Set images. (Yes I know this is a hacky way to do it...)
                const images = ['image1', 'image2', 'image3', 'image4']
                let tempImagesArray = []
                images.forEach(i => {
                    if(ride[i] !== undefined) {
                        tempImagesArray.push(ride[i])
                    }
                })
                setPhotos(tempImagesArray)
                
                // Set download status
                setDownload({loaded: true, error: null})  
            }).catch(error => {
                console.log(error)
                setDownload({loaded: false, error: error})
            })            
    }, [])

    // Render some stuff.
    if(download.error) {
        return(
            <Grid direction='column' container>
                <h1>Error!!</h1>
                <p>{download.error.toString()}</p>
            </Grid>
        )
    } else if(!download.loaded) {
        return(
            <Grid direction='column' container>
                <h1>Loading ride...</h1>
            </Grid>
        )
    } else {
        return(
            <Container>

            <Grid direction='column' container>
                <Grid item>
                    <h1>{title}</h1>
                    <h3>{formatDate(rideData.activity.timestamp)}</h3>
                </Grid>
                <Grid item>
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
                        <Marker position = {getLongLatFloat(rideData.records)[0]}>Start</Marker>
                        <Marker position = {getLongLatFloat(rideData.records)[getLongLatFloat(rideData.records).length - 1]}>Stop</Marker>
                    </Map>
                </Grid> 
                <Grid container direction="row" justify="center" alignItems="center" spacing={5}>
                        <Grid item><h5>Distance: {rideData.sessions[0].total_distance.toFixed(2)}</h5></Grid>
                        <Grid item><h5>Feet Climbed: {(rideData.sessions[0].total_ascent).toFixed(2)}</h5></Grid>
                        <Grid item><h5>Feet Descended: {(rideData.sessions[0].total_descent).toFixed(2)}</h5></Grid>
                </Grid>
                <Grid item>
                    <p>{description}</p>
                </Grid>
                <Grid item>
                    <ElevationChart 
                        elevationData={getElevationAtDistance(rideData.records).map(d => {return d[1]})}
                        distanceData={getElevationAtDistance(rideData.records).map(d => {return d[0]})}
                    />
                </Grid>
                <Grid container direction='row' justify='center' alignItems='center' spacing={5}>
                    {photos && photos.map((photo,i) => <Grid item><Image image={photo}/></Grid>)}
                </Grid>
            </Grid>
            </Container>
        )
    }
}

export default RideView