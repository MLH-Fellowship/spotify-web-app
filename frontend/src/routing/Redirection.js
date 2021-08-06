import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import auth from '../auth/Auth';

const Redirection = () => {
    const [token, setToken] = useState('');

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
    }

    useEffect(() => {
        // if there are params in url, get the token from there
        if (window.location.hash) {
            const { access_token } = getReturnedParamsFromSpotifyAuth(window.location.hash);
            console.log(access_token);
            localStorage.clear();
            auth.login(()=>{
                console.log('logged in');
            });
            auth.setToken(access_token);
            setToken(access_token);
        }
    }, []);

    return (
            token ? 
                <Redirect to='/' /> 
            : 
                <div>
                    Redirecting...
                </div>

    );
};

export default Redirection;