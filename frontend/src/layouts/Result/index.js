import React, {useState, useEffect} from 'react'
import SongList from '../../components/SongList'
import PlaylistTop from '../../components/PlaylistTop'
import { Grid } from '@material-ui/core';

function Result(props){
    const [capturedImage, setCapturedImage] = useState(null)
    const [playlistData, setPlaylistData] = useState({});
    const [emotion, setEmotion] = useState('');

    useEffect(() => {
        setCapturedImage(props.location.state.capturedImage)
        setPlaylistData(props.location.state.playlistData)
        setEmotion(props.location.state.emotion)
    })
        
    return (
        <>
            <Grid container direction="column">
                <Grid item xs={12}>
                    <img style={{ height: '420px', marginTop: 64, boxShadow: '0px 0px 12px 0px #505050', borderRadius:'3%' }} src={capturedImage} alt={'Captured img'} /> 
                </Grid>
            </Grid>
            <Grid container direction="column" justifyContent="center">
                <Grid item xs={12}>
                    <h1 className='greetings'>You are looking {emotion}</h1>
                    <h2 style={{ marginLeft: '84px' }} className='title-3'>Take a look at this recommendation based on you favourite genres 🎸</h2>
                </Grid>
            </Grid>
            <Grid container direction="column">
                <Grid item xs={12}>
                    {playlistData.tracks && 
                    <>
                        <Grid container style={{ height: 150, background: 'linear-gradient(0deg, rgba(25,20,20,1) 12%, rgba(25,20,20,0.6937149859943977) 46%, rgba(25,20,20,0.4192051820728291) 71%, rgba(25,20,20,0.27914915966386555) 80%, rgba(255,255,255,0) 95%)' }}></Grid>
                        <PlaylistTop playlist={playlistData}/>
                        <SongList playlist={playlistData} songs={playlistData.tracks.items.slice(0,20)}/>
                    </>}
                </Grid>
            </Grid>
        </>

    )
}

export default Result