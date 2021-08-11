import React, {useState} from 'react'
import WebcamCapture from './webcam'
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import axios from 'axios';

import './capture.scss'

function Capture(){

    const [capturedImage, setCapturedImage] = useState(null)

    const onRetakeClick = () => {
        setCapturedImage(null)
    }

    const onSubmitClick = async () => {

        //Send API request 
        var formData = new FormData()
        const base64Response = await fetch(capturedImage);
        const blob = await base64Response.blob();
        formData.append("image", blob)

        axios({
            method:"post",
            url: "http://localhost:5000/imageToEmotion",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(function(response) {
            //handle success  --> redirect to display result
            console.log(response.data)
        })
        .catch(function(response) {
            //handle failure 
            console.log(response)
        })
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