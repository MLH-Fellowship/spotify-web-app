import React, {useState} from 'react'
import WebcamCapture from './webcam'
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import SongList from '../../components/SongList'
import PlaylistTop from '../../components/PlaylistTop'

import './capture.scss'

function Capture(){

    const [capturedImage, setCapturedImage] = useState(null)
    const [playlistData, setPlaylistData] = useState({});

    const onRetakeClick = () => {
        setCapturedImage(null)
        setPlaylistData({});
    }
    const getData = async (endpoint, setFunction) => {
        try {
            const { data } = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });
            setFunction(data);
            console.log(data);
          } catch (error) {
            console.log(error);
        }
    };

    const onSubmitClick = () => {
        //Redirect to Loading screen 
        getData('https://api.spotify.com/v1/playlists/1pW6gAv6FdeHajhcbbldo9', setPlaylistData);
    }

    return (
        <Grid container >
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

            
            {!capturedImage &&
                <WebcamCapture setCapturedImage={setCapturedImage}/>}
        </Grid>
    )
}

export default Capture