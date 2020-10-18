import React from 'react'
import {Grid, Button, TextField} from '@material-ui/core'
import {DropzoneArea} from 'material-ui-dropzone'
import {useHistory} from 'react-router-dom'
 
function RideUploader({maxImages}) {
    const [files, setFiles] = React.useState([])
    const [rideID, setRideID] = React.useState()
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState()
    const [title, setTitle] = React.useState()
    const [description, setDescription] = React.useState()
    const history = useHistory()

    const handleChange = (files) =>  {
        setFiles(files)
    }

    // Check to make sure we have the proper files.  Do any prep work.
    const checkFiles = () => {}
    
    // Send files to the API.
    const uploadFiles = () => {
        setLoading(true)
        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)

        // Add a .fit file and up to 4 images to the formData.
        // Reaaaaally hacky..
        let imagesAttached = 0 
        files.forEach(file => {
            if(file.name.endsWith('.fit') || file.name.endsWith('.gpx')) {
                formData.append('rideFile', file)
            }
            else {
                if (imagesAttached < maxImages) {
                    imagesAttached += 1
                    formData.append(`image${imagesAttached}`, file)
                }
            }
        })

        fetch(`${process.env.REACT_APP_API_URL}/rides`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            setLoading(false)
            setRideID(data)
        })
        .catch(error => {
            setError(error)
        })
    }
  
    // If we have a ride uploaded and have recieved an ID code go ahead and nav to it.
    if (rideID) {
        history.push(`/ride/${rideID}`)
    }

    // Otherwise render our interface or errors.
    return(
        <Grid container direction='column' justify='flex-start' alignItems='center'> 
            {error && <Grid item>
                <h3>Some error has occured!</h3> 
                <p>{error}</p>
            </Grid>}
            
            <Grid item>
                <h1>MemeCycle</h1>
            </Grid>
            <Grid item>
                <h3>Share a ride</h3>
            </Grid>
            <Grid item>
                <DropzoneArea onChange={handleChange} filesLimit={5} acceptedFiles={['image/*', '.fit', '.gpx']}/>
            </Grid>
           <Grid item>
                <p>Upload a .fit file and some pictures of your ride!</p>
            </Grid>
            <Grid item>
                <TextField id="standard-basic" label='Ride Title' onChange = {(event) => setTitle(event.target.value)}/>
            </Grid>
            <Grid item>
                <TextField
                    id='ride-description'
                    label="Ride Description"
                    multiline
                    rows={4}
                    variant="filled"
                    onChange = {(event) => {setDescription(event.target.value)}}
                />
            </Grid>
            <Grid item>
                <Button variant='contained' color='primary' disabled = {(files.length === 0)} onClick ={uploadFiles}>
                    Upload
                </Button>
            </Grid>
        </Grid>
    )
}

RideUploader.defaultProps = {
    maxImages: 4,
}

export default RideUploader