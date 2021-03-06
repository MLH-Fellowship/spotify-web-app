import React, { useState, useEffect } from 'react'

import axios from 'axios';
import { Grid } from '@material-ui/core';
import { Fade } from 'react-reveal';
import { CLIENT_ID, CLIENT_SECRET, SPOTIFY_AUTHORIZE_ENDPOINT, REDIRECT_URL_AFTER_LOGIN, SCOPES_URL_PARAM } from '../../auth/Spotify';
import _ from 'lodash';

import './welcome.scss';

function Welcome() {
    const [sliderImages, setSliderImages] = useState([]);

    useEffect( () => {
        axios.get(process.env.REACT_APP_BACK_URL + '/get-songs')
            .then( response => {
                let temp = []
                response.data.data.forEach( song => {
                    temp.push(song.link)
                });
                setSliderImages(temp)
            })
            .catch( e => {
                console.error(e);
            })
    }, [])

    const handleLogin = () => {
        window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=code`;
    };

    const getRandomImages = ( num ) => {
        let images = [];

        _.times( Math.min(num, sliderImages.length), ( i ) => {
            images.push(
		        <div class="slide">
                    <img className='playlist-cover' key={`${i}-image`} src={ sliderImages[i] } alt='Playlist Cover'/>
                </div>
            )
        })

        return images
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <div class="slider">
                    <div class="slide-track">
                        { getRandomImages(15) }
                    </div>
                </div>
            </Grid>
            <Grid container item xs={12} style={{ padding: '5%' }}>
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6} style={{ textAlign: 'left', fontSize: '3.5rem'}}>
                <Fade>
                    <span><b>Find New Music Based on Your Emotions and Music Taste</b></span><br/>
                    <button 
                        onClick={handleLogin}
                        className='button--login' 
                        size="large"
                    >
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
                    <p>Made by @S4ND1X @saulmontesdeoca @ccejudo @athenaleong @jioh-kim</p>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Welcome
