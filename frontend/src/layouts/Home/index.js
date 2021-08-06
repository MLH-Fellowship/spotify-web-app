import React, { useState, useEffect } from 'react';
import axios from 'axios';
import auth from '../../auth/Auth';

const Home = () => {
    const [data, setData] = useState({});
    const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

    console.log(data)

    // makes a request to spotify endpoint to get the user's playlists
    const handleGetPlaylists = () => {
        axios.get(PLAYLISTS_ENDPOINT, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"), // getting token from local storage
            },
          })
          .then((response) => {
            setData(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      };

    // gets the user's token from url params
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
        // if there are params in url, get the token from there
        if (window.location.hash) {
            const { access_token, expires_in, token_type } = getReturnedParamsFromSpotifyAuth(window.location.hash);
            
            localStorage.clear();
            localStorage.setItem("token", access_token);
            localStorage.setItem("tokenType", token_type); // "Bearer" is the one will be getting and using
            localStorage.setItem("expiresIn", expires_in); // 3600 seconds
            auth.login(()=>{
                console.log('logged in');
            });
        }
    }, []);



    return (
        <div>
            <h1> Hello from Home! </h1> 
            <button onClick={handleGetPlaylists}>Get Playlists</button>
            {data?.items ? data.items.map((item) => <p>{item.name }</p>) : null}
        </div>
    );
};

export default Home;