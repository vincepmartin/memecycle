import React from 'react'
import {Grid, Button} from '@material-ui/core'
import {DropzoneArea} from 'material-ui-dropzone'
import {useHistory} from 'react-router-dom'
 
function RideUploader({maxImages}) {
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

        // Add a .fit file and up to 4 images to the formData. 
        let imagesAttached = 0 
        files.forEach(file => {
            console.log('*** Processing file:') 
            console.log(file)
            if(file.name.endsWith('.fit')) {
                console.log(`Processing fit file: ${file.name}`)
                console.log('\tAdding fit file.')
                formData.append('rideFile', file)
            }
            else {
                console.log(`Processing ${file.name}`)
                console.log(`Images attached: ${imagesAttached} maxImages: ${maxImages}`)
                if (imagesAttached < maxImages) {
                    imagesAttached += 1
                    console.log(`\t*** Appending: image${imagesAttached}`)
                    formData.append(`image${imagesAttached}`, file)
                }
            }
        })

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
                <DropzoneArea onChange={handleChange} filesLimit={5} acceptedFiles={['image/*', '.fit']}/>
            </Grid>
           <Grid item>
                <p>Upload a .fit file and some pictures of your ride!</p>
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