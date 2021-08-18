import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { Redirect } from 'react-router';

function Loading(props) {
    const [capturedImage, setCapturedImage] = useState(null)
    const [playlistData, setPlaylistData] = useState({});
    const [emotion, setEmotion] = useState('');
    const [error, setError] = useState(false);


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

    useEffect(async() => {
        setCapturedImage(props.location.state.capturedImage)

        var formData = new FormData()
        const base64Response = await fetch(props.location.state.capturedImage);
        const blob = await base64Response.blob();
        formData.append("image", blob)
        await axios({
            method:"post",
            url: "http://localhost:5000/imageToEmotion",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(async function(response) {
            //handle success  --> redirect to display result
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
                    
            }).catch(function(response) {
                //handle failure 
                setError(true);
                console.log('Playlist Generation Failed')
            })
        
        })
        .catch(function(response) {
            //handle failure 
            setError(true);
            console.log('Emotion Detection Failed')
        })
        
    })

    return (
        <>
        <p>HI!</p>
        {
            playlistData.tracks && <Redirect 
            to={{
                pathname: "/result" ,
                state: {emotion: emotion,
                        playlistData: playlistData,
                        capturedImage: capturedImage
                }
            }}/>
        }
        {
            error && <Redirect
            to={{pathname:'/capture'}}
            />
        }
        </>

    )
}

export default Loading 