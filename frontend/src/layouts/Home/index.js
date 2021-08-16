import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import auth from '../../auth/Auth';
import { Helmet } from 'react-helmet';
import { Grid } from '@material-ui/core';
import './home.scss';

const Home = () => {
    const [playlists, setPlaylists] = useState({});
    const [artists, setArtists] = useState({});
    const [tracks, setTracks] = useState({});
    const [profile, setProfile] = useState({});

    const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
    const TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks?time_range=long_term";
    const ARTISTS_ENDPOINT = "https://api.spotify.com/v1/me/top/artists?time_range=long_term";
    const PROFILE_ENDPOINT = "https://api.spotify.com/v1/me";

    // General get request function
    const getData = async (endpoint, setFunction) => {
        try {
            const { data } = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });
            setFunction(data);
          } catch (error) {
            auth.logout(() => { console.log("Logged out") });
        }
    };

    // // gets the user's token from url params
    const getReturnedParamsFromSpotifyAuth = (hash) => {
        const stringAfterHashtag = hash.substring(1); // removes the # which is at the beginning of the string
        const paramsInUrl = stringAfterHashtag.split("&"); // params in url are split by &
        const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
            const [key, value] = currentValue.split("=");
            accumulater[key] = value;
            return accumulater; // returns a object with the params
        }, {});
      
        return paramsSplitUp;
      };

    useEffect(() => {

        //if there are params in url, get the token from there
        if (window.location.hash) {
            const { access_token, expires_in, token_type } = getReturnedParamsFromSpotifyAuth(window.location.hash);
            
            localStorage.clear();
            localStorage.setItem("token", access_token);
            localStorage.setItem("tokenType", token_type); // "Bearer" is the one will be getting and using
            localStorage.setItem("expiresIn", expires_in); // 3600 seconds
            auth.login(()=>{
                console.log('logged in');
            });
            window.history.pushState({}, null, "/")
        }
        getData(PLAYLISTS_ENDPOINT, setPlaylists);
        getData(TRACKS_ENDPOINT, setTracks);
        getData(ARTISTS_ENDPOINT, setArtists);
        getData(PROFILE_ENDPOINT, setProfile);
    }, []);



    return (
        <div>
            <Helmet>
                <title>Home</title>
            </Helmet>
            <Grid container justifyContent="center" >
              <Grid item xs={12}>
                  <div className="slider">
                      <div className="slide-track">
                      {playlists.items && playlists.items.map((item, key) => (
                        <div className="slide">
                            <img className='playlist-cover' key={key} src={item.images[0].url} alt='Artist Cover'/>
                        </div>
                      ))}
                      </div>
                  </div>
              </Grid>
              <Grid item xs={3} style={{marginTop: "80px"}}>
                { profile.images && 
                  <img style={{borderRadius:'50%', boxShadow: '0px 0px 48px 0px #505050'}} src={profile.images[0].url} alt="profile" /> 
                }
              </Grid>
              <Grid container xs={4} justifyContent="flex-start">
                { profile.display_name && 
                  <h1 className='greetings'>Hey there, <br/>{profile.display_name}! 👋</h1>
                }
                <Grid item xs={6}>
                  <Link to={'/capture'}>
                    <button
                            className='button--login' 
                            size="large"
                        >
                        PLAY
                    </button>
                  </Link>
                </Grid>
                <Grid item xs={6}>
                  <h3 className='title-3'>Click Play to take a pic for a song recomendation!</h3>
                </Grid>
                
                
              </Grid>
            </Grid>

            {tracks.items &&
              <Grid container justifyContent="center" >
                <Grid container xs={10} justifyContent="flex-start">
                    <h1 className='greetings'>The song that has always been there for you:</h1>                  
                </Grid>
                <Grid item xs={4} style={{marginTop: "20px"}}>
                    <img style={{ height: '420px', boxShadow: '0px 0px 12px 0px #505050', borderRadius:'3%' }} src={tracks.items[9].album.images[0].url} alt={tracks.items[9].name} /> 
                </Grid>
                <Grid container xs={4} justifyContent="flex-start">
                  <Grid item xs={12} style={{ marginTop: '64px' }}>
                    <h1 className='song'>{tracks.items[9].name}</h1>
                    <h2 className='album'> {tracks.items[9].album.name}</h2>
                    <h2 className='artist'>By {tracks.items[9].artists[0].name}</h2>
                  </Grid>
                  
                </Grid>
              </Grid> 
            }
            {tracks?.items ? 
              <Grid container justifyContent="center" style={{marginTop: "128px", paddingBottom: "128px", paddingTop: "48px", backgroundColor: '#333333'}} spacing={2}>
                <Grid item xs={12} >
                  <h2 style={{ color: 'white', paddingLeft: '64px'}} className='title-2'>Your top songs of all time</h2>
                </Grid>
                <Grid container style={{marginLeft: "64px", marginRight: "64px"}}>
                {tracks.items.map((item, key) => {
                    if(key < 9) {
                    return <Grid item xs={4}>
                              <img style={{ height: '370px', boxShadow: '0px 0px 12px 0px #505050', borderRadius:'3%' }} src={item.album.images[0].url} alt={item.name} />
                              <Grid item xs={12}>
                                <p style={{ color: 'white', fontSize: '22px', fontWeight: 'bold' }}><strong className='strong'>#{key+1}</strong> {item.name}</p>
                              </Grid>
                          </Grid>}
                    else {
                      return null;
                    }

                }
                )}
                </Grid>
              </Grid>
              : null}
            {artists?.items ? 
              <Grid container justifyContent="center" style={{marginTop: "64px", paddingLeft: '128px', paddingRight: '128px', paddingBottom: "64px"}} spacing={4}>
                <Grid item xs={12} >
                  <h2 className='title-2'>Your favourite artists</h2>
                </Grid>
                {artists.items.map((item) => <img style={{ height: '126px', boxShadow: '0px 0px 12px 0px #505050', borderRadius:'50%', margin: '12px' }} src={item.images[0].url} alt={item.name} />) }
              </Grid>
              
            : null}
            {playlists?.items ?
              <Grid container justifyContent="center" style={{marginTop: "128px", paddingBottom: "128px", backgroundColor: '#CC8828'}} spacing={4}>
                <Grid item xs={12} >
                  <h2 style={{ color: 'white', paddingLeft: '64px'}} className='title-2'>Top Playlists you can't live without</h2>
                </Grid>
                {playlists.items.map((item, key) => {
                    if(key < 4) 
                    return <Grid item>
                        <img style={{ height: '256px', boxShadow: '0px 0px 12px 0px #505050', borderRadius:'3%' }} src={item.images[0].url} alt={item.name} />
                        <Grid item xs={12}>
                          <p style={{ color: 'white', fontSize: '22px', fontWeight: 'bold' }}>{item.name}</p>
                        </Grid>
                      </Grid>
                })}
              </Grid>
              : null}
        </div>
    );
};

export default Home;
