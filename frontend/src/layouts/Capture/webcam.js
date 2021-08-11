import React from 'react'
import Webcam from "react-webcam";
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import './webcam.scss'

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user'
}

const WebcamCapture = (props) => {
    const webcamRef = React.useRef(null)


    const capture  = React.useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot();
            props.setCapturedImage(imageSrc)
        },
        [webcamRef]
    )

    return (
        <Grid container direction="column" justify-content="center">
        <Grid item>
            <Webcam
                audio={false}
                height={720}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={720}
                videoConstraints={videoConstraints}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={capture}>Capture photo</Button>
          </Grid>
        </Grid>
    );
}

export default WebcamCapture