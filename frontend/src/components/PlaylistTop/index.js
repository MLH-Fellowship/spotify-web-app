import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Alert from '@material-ui/lab/Alert';

const PlaylistTop = (props) => {
    const [noDevice, setNoDevice] = useState(false);
    const [errorFollowPlaylist, setErrorFollowPlaylist] = useState(false);
    const getFollowPlaylistURL = (playlistId) => {
        return `https://api.spotify.com/v1/playlists/${playlistId}/followers`;
    }

    const playPlaylist = async (playlistId) => {
        const GET_DEVICES_URL = 'https://api.spotify.com/v1/me/player/devices';
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
        await fetch(GET_DEVICES_URL, options)
            .then(response => response.json())
            .then(async data => {
                if(data.devices[0]){
                    const playURL = `https://api.spotify.com/v1/me/player/play?device_id=${data.devices[0].id}`;
                    const options = {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            context_uri: `spotify:playlist:${playlistId}`
                        })
                    }
                    await fetch(playURL, options)
                        .then(response => response.json())
                        .then(data => {})
                        .catch(error => console.log(error));
                }
                else{
                    setNoDevice(true);
                }
            })
            .catch(error => setNoDevice(true));
    }

    const handleFollowPlaylist = async (playlistId) => {
        const url = getFollowPlaylistURL(playlistId);
        const options = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }
        await fetch(url, options)
            .then(response => response.json())
            .then(data => {})
            .catch(error => {});
    }

    const handlePlayPlaylist = async (playlistId) => {
        playPlaylist(playlistId);

    }

    return (
        <Grid container direction="row" style={{ paddingLeft: '10%', paddingRight: '10%', paddingBottom: 70, backgroundColor: '#191414',  }}>
            <Grid item >
                <img style={{ height: '220px', boxShadow: '0px 0px 12px 0px #505050' }} src={props.playlist.images[0].url} alt='Artist Cover'/>
            </Grid>
            <Grid item style={{ marginLeft: 64 }}>
                <Grid container direction="column">
                    <Grid item xs={1}>
                        <h5 style={{color: 'rgb(206, 206, 206)'}}>Playlist</h5>
                    </Grid>
                    <Grid item>
                        <h3 className='playlist-title'>{props.playlist.name}</h3>
                    </Grid>
                    <Grid item xs={6} style={{ paddingTop: '5%' }}>
                        <button onClick={() => handlePlayPlaylist(props.playlist.id)} style={{borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,1) 32%, rgba(186,184,184,1) 34%, rgba(25,20,20,1) 37%)', borderColor: '#191414', borderStyle: 'solid'}}>
                            <PlayCircleFilledIcon style={{ color: '#1DB954', fontSize: 100, }} />
                        </button>
                        <button onClick={() => handleFollowPlaylist(props.playlist.id)} style={{borderColor: '#191414', background: '#191414', borderStyle: 'solid'}}>
                            <FavoriteIcon style={{ color: 'white', fontSize: 42, paddingBottom: 24, paddingLeft: 24 }} />
                        </button>
                    </Grid>
                </Grid>
            </Grid>
            {
                noDevice &&
                <div style={{width: '100%'}}>
                    <Alert severity="info" onClose={() => setNoDevice(false)}>
                        Device not found. Please open Spotify in any device before playing the playlist.
                    </Alert>
                </div>
            }
            {
                errorFollowPlaylist && 
                <div style={{width: '100%'}}>
                    <Alert severity="error" onClose={() => setErrorFollowPlaylist(false)}>
                        Error following playlist.
                    </Alert>
                </div>
            }
        </Grid>
    );
};

export default PlaylistTop;