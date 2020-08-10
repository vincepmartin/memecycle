import React from 'react'
import Grid from '@material-ui/core/Grid'
import RideUploader from '../RideUploader/RideUploader'
import RideList from '../RideList/RideList'
import RideView from '../RideView/RideView'

function MemeCycle(props) {

    return (
        <Grid direction='column' container>
            <Grid item>
                <h1>Meme Cycle</h1>
                <p>Upload a ride!</p>
            </Grid>

            <Grid item>
                <RideUploader></RideUploader>
            </Grid>

            <Grid item>
                <RideList></RideList>
            </Grid>

            <Grid item>
                <RideView></RideView>
            </Grid>
        </Grid>
    )
}

export default MemeCycle