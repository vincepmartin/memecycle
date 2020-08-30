import React from 'react'
import {Grid, Button} from '@material-ui/core'
import {DropzoneArea} from 'material-ui-dropzone'
import {useHistory} from 'react-router-dom'
 
function RideUploader(props) {
    const [files, setFiles] = React.useState([])
    const [rideID, setRideID] = React.useState()
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState()
    const history = useHistory()

    const handleChange = (files) =>  {
        console.log('setting files')
        console.log(files)
        setFiles(files)
    }

    // Check to make sure we have the proper files.  Do any prep work.
    const checkFiles = () => {}
    
    // Send files to the API.
    const uploadFiles = () => {
        setLoading(true)
        const formData = new FormData()
        console.log(files)

        // Check to see if we have a .fit file.
        console.log('Try to find the .fit file if avaliable.') 
        console.log(files.find(f => f.name.endsWith('.fit')))
        console.log(files.find(f => f.name.endsWith('.jpg')))

        // TODO: In a spot where I have to start managing multiple files. 
        formData.append('rideFile', files[0])
        
        // Doo the same for the images.

        fetch('http://localhost:8080/rides', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('ride uploaded')
            console.log(data)
            setLoading(false)
            setRideID(data)
        })
        .catch(error => {
            console.error(error)
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
                <h1>Share a ride</h1>
            </Grid>
            <Grid item>
                <DropzoneArea onChange={handleChange}/>
            </Grid>
           <Grid item>
                <p>Upload a .fit file and some pictures of your ride!</p>
            </Grid>
            <Grid item>
                <Button variant="contained" color="secondary" disabled = {(files.length === 0)} onClick ={uploadFiles}>
                    Upload
                </Button>
            </Grid>
        </Grid>
    )
}

export default RideUploader