import React, {useState} from 'react'
import { Helmet } from 'react-helmet';
import WebcamCapture from './webcam'

import './capture.scss'
import { Redirect } from 'react-router';

function Capture(){
    const ARTISTS_ENDPOINT = "https://api.spotify.com/v1/me/top/artists?time_range=long_term";
    const [capturedImage, setCapturedImage] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const onRetakeClick = () => {
        setCapturedImage(null)
        setError(false);
    }
    
    const onSubmitClick = () => {
       //Send API request 
        setLoading(true);

    }

    return (
        <>
        <Helmet>
            <title>Recomendation</title>
        </Helmet>
        <Grid container >
            <Grid container xs={10} justifyContent="flex-start">
                <h1 className='greetings'>Let's see how you feel today </h1>                  
            </Grid>
            {capturedImage &&
                <Grid container justifyContent="center" >
                    <Grid item xs={7} style={{marginTop: "20px"}}>
                        <img style={{ height: '420px', boxShadow: '0px 0px 12px 0px #505050', borderRadius:'3%' }} src={capturedImage} alt={'Captured img'} /> 
                    </Grid>
                    <Grid container xs={4} justifyContent="flex-start">
                    <Grid item xs={12} style={{ marginTop: '64px' }}>
                        <Grid container xs={12} justifyContent="flex-start">
                            <Grid item xs={12} style={{ marginTop: '64px' }}>
                                <button className='button--login' size="large" onClick={onSubmitClick}>Submit</button>
                            </Grid>
                            <Grid item xs={12} style={{ marginTop: '64px' }}>
                                <button className='button--login-white' size="large" onClick={onRetakeClick}>Retake</button>
                            </Grid>
                        </Grid>
                    </Grid>
                    
                    </Grid>
                </Grid> 
            }
            {!capturedImage &&
                <Grid container justifyContent="center" >
                    <Grid item xs={5}>
                        <WebcamCapture setCapturedImage={setCapturedImage}/>
                    </Grid>
                </Grid>
            }
            {
            loading && <Redirect to={{
                         pathname: "/loading",
                         state: {
                            capturedImage: capturedImage
                         }
                }}/>
            }
            {
                error ?
                <Grid container direction="column">
                    <Grid item xs={12}>
                        <h1>Sorry at this moment we couldn't find your emotion, try again if you'd like!</h1>
                    </Grid>
                </Grid> : <p>hi</p>

            }
            

        </Grid>
        </>
    )
}

export default Capture
