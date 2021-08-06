import React, {useState} from 'react'
import WebcamCapture from './webcam'
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import './capture.scss'

function Capture(){

    const [capturedImage, setCapturedImage] = useState(null)

    const onRetakeClick = () => {
        setCapturedImage(null)
    }

    const onSubmitClick = () => {
        //Redirect to Loading screen 
    }

    return (
        <Grid container>
            {capturedImage &&
            <>
                <Grid container direction="column">
                    <Grid item>
                        <img src={capturedImage}></img>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={onSubmitClick}>Submit</Button>
                        <Button variant="contained" color="default" onClick={onRetakeClick}>Retake</Button>
                    </Grid>
                </Grid>
            </>
            }
            {!capturedImage &&
                <WebcamCapture setCapturedImage={setCapturedImage}/>}
        </Grid>
    )
}

export default Capture