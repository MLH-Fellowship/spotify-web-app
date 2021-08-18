import React, {useState} from 'react'
import { Helmet } from 'react-helmet';
import WebcamCapture from './webcam'
import { Grid } from '@material-ui/core';
import axios from 'axios';
import SongList from '../../components/SongList'
import PlaylistTop from '../../components/PlaylistTop'
import LinearProgress from '@material-ui/core/LinearProgress';

import './capture.scss'

function Capture(){
    const ARTISTS_ENDPOINT = "https://api.spotify.com/v1/me/top/artists?time_range=long_term";
    const [capturedImage, setCapturedImage] = useState(null)
    const [playlistData, setPlaylistData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [emotion, setEmotion] = useState('');

    const onRetakeClick = () => {
        setCapturedImage(null)
        setPlaylistData({});
        setError(false);
        setEmotion('');
    }
    const getData = async (endpoint, setFunction) => {
        try {
            const { data } = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });
            setFunction(data);
          } catch (error) {
            setError(true);
        }
    };

    const onSubmitClick = async () => {

       //Send API request 
        var formData = new FormData()
        const base64Response = await fetch(capturedImage);
        const blob = await base64Response.blob();
        formData.append("image", blob)
        setLoading(true);
        await axios({
            method:"post",
            url: "https://spotime-back.duckdns.org/imageToEmotion",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(async function(response) {
            //handle success  --> redirect to display result
            if(response.data[1] < 0.50){
                setError(true);
            }
            else{
                setEmotion(response.data[0]);
                await axios({
                    method:"post",
                    url: "http://localhost:5000/emotionToPlaylist",
                    data: {
                        emotion: response.data[0]
                    },
                    headers: { "Content-Type": "application/json" }
                }).then(function(response) {
                        let playlistId = response.data.playlists.items[0].id;
                        getData(`https://api.spotify.com/v1/playlists/${playlistId}`, setPlaylistData);
                        setError(false);
                }).catch(function(response) {
                    //handle failure 
                    setError(true);
                })
            }
        })
        .catch(function(response) {
            //handle failure 
            setError(true);
        })
        setLoading(false);
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
                loading &&
                <>
                <Grid container direction="column" justifyContent="center" style={{marginTop: "20px"}}>
                        <LinearProgress />
                    </Grid>
                <Grid container direction="column" justifyContent="center" >
                    <Grid item xs={10}>
                        <h1 className='greetings'>Calculating based on you taste..</h1>
                        <h2 style={{ marginLeft: '84px' }} className='title-3'>A little bit weird your taste of music 🤔 but whatever </h2>
                    </Grid>
                    
                </Grid>
                </>
            }
            {
                error ?
                <Grid container direction="column">
                    <Grid item xs={12}>
                        <h1>Sorry at this moment we couldn't find your emotion, try again if you'd like!</h1>
                    </Grid>
                </Grid>
                :
                emotion && 
                <Grid container direction="column" justifyContent="flex-start">
                    <Grid item xs={12}>
                        <h1 className='greetings'>Your emotion is: {emotion}</h1>
                        <h2 style={{ marginLeft: '84px' }} className='title-3'>Take a look at this recommendation based on you favourite genres 🎸</h2>
                    </Grid>
                </Grid>
            }
            {
                <Grid container direction="column">
                    <Grid item xs={12}>
                    {playlistData.tracks && 
                    <>
                        <Grid container style={{ height: 150, background: 'linear-gradient(0deg, rgba(25,20,20,1) 12%, rgba(25,20,20,0.6937149859943977) 46%, rgba(25,20,20,0.4192051820728291) 71%, rgba(25,20,20,0.27914915966386555) 80%, rgba(255,255,255,0) 95%)' }}></Grid>
                        <PlaylistTop playlist={playlistData}/>
                        <SongList songs={playlistData.tracks.items.slice(0,20)}/>
                    </>}
                </Grid>
                </Grid>
            }
            {

            }
        </Grid>
        </>
    )
}

export default Capture
