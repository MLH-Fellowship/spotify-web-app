import React from 'react'

import { Grid } from '@material-ui/core';
import { Fade } from 'react-reveal';
import _ from 'lodash';

import './welcome.css';

function Welcome() {
    const getRandomImages = ( num ) => {
        let images = [];

        _.times( num, ( i ) => {
            images.push(<img className='playlist-cover' key={`${i}-image`} src={`https://picsum.photos/seed/${i+1}/100`} alt='Playlist Cover'/>)
        })

        return images
    }

    return (
        <Grid container>
            <Grid item xs={12} className="animated-playlists">
                <div style = {{width:"200%"}}>
                { getRandomImages(7) }
                </div>
            </Grid>
            <Grid container item xs={12} style={{ padding: '5%' }}>
                <Grid item xs={6}>
                <Fade>
                    <div style = {{ padding: '1% 20%' }}>
                    <img 
                        className='bounce'
                        style={{ objectFit: 'contain' }}
                        src={'https://i.pinimg.com/originals/ac/c2/95/acc2958e32becdb2362233c74115fdd7.png'} 
                        alt="Cassette Vector"
                    />
                    </div>
                </Fade>
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'left', fontSize: '3.5rem'}}>
                <Fade>
                    <span><b>Find New Music Based on Your Emotions and Music Taste</b></span><br/>
                    <button className='button--login' size="large">
                    Log In With Spotify
                    </button>
                    </Fade>
                </Grid>
            </Grid>
            <Grid container justifyContent={'space-around'} item xs={12} style={{ position: 'absolute', bottom: '0'}}>
                <Grid item xs={6} style={{ padding: '1% 3%', textAlign: 'left'}}>
                <p>SpotiMe / Moodify</p>
                </Grid>
                <Grid item xs={6} style={{ padding: '1% 3%', textAlign: 'right'}}>
                <p>Made by @athenaleong @S4ND1X @saulmontesdeoca @ccejudo</p>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Welcome
