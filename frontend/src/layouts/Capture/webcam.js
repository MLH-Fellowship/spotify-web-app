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
                style={{height: '420px',boxShadow: '0px 0px 11px 0px #505050', borderRadius:'3%' }}
                audio={false}
                height={720}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={720}
                videoConstraints={videoConstraints}
            />
          </Grid>
          <Grid item>
            <button className='button--capture' onClick={capture}>Capture photo</button>
          </Grid>
        </Grid>
    );
}

export default WebcamCapture