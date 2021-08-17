import React from 'react';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import FavoriteIcon from '@material-ui/icons/Favorite';
import GetAppIcon from '@material-ui/icons/GetApp';

const PlaylistTop = (props) => {
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
                        <Link to={'/capture'}>
                            <PlayCircleFilledIcon style={{ color: '#1DB954', fontSize: 100, }} />
                        </Link>
                        <Link to={'/capture'}>
                            <FavoriteIcon style={{ color: 'white', fontSize: 42, paddingBottom: '10%', paddingLeft: 24 }} />
                        </Link>
                        <Link to={'/capture'}>
                            <GetAppIcon style={{ color: 'white', fontSize: 42, paddingBottom: '10%', paddingLeft: 24  }} />
                        </Link>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default PlaylistTop;