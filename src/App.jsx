import { useState, useEffect } from 'react';
import TotalPlaylists from './TotalPlaylists';
import Filter from './Filter';
import Playlist from './Playlist';
import TotalHours from './TotalHours';
import queryString from 'query-string';

function App() {
    let searchParams = {};
    const [serverData, setServerData] = useState({ user: {} });
    const [filterString, setFilterString] = useState('');

    function requestData() {
        // setServerData()
    }

    let filteredPlaylists = serverData.user && serverData.user.playlists ? serverData.user.playlists.filter(playlist => {
        let names = playlist.name.toLowerCase().includes(filterString);
        let songs = false;
        for (let i = 0; i < playlist.songs.slice(0,3).length; i++) {
            if (playlist.songs[i].name.toLowerCase().includes(filterString)) {
                songs = true;
                break;
            }
        }
        return names || songs;
    }
    ) : [];

    const hours = filteredPlaylists ? filteredPlaylists.reduce((sum, currentPlaylist) => {
        for (let i = 0; i < currentPlaylist.songs.length; i++) {
            sum += (currentPlaylist.songs[i].duration);
        }
        return sum;
    }, 0) : 0;

    useEffect(() => {
        const searchParams = queryString.parse(window.location.search);
        let accessToken = searchParams.access_token;
        if (accessToken){
            const fetchUserData = fetch('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            }).then(response => response.json());
    
            const fetchUserPlaylists = fetch('https://api.spotify.com/v1/me/playlists', {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }})
            .then(response => response.json())
            .then(playlistData => {
                let PlaylistsObjs = playlistData.items.map(item => {
                        let songs = fetch(item.tracks.href,{
                            headers: {
                                Authorization: 'Bearer ' + accessToken
                            }}
                        )
                        return songs
                        .then(songPromise => songPromise.json())
                        .then(songData => {
                            return songData.items.map((currentSong)=>{
                                let time =  (currentSong.track.duration_ms/3600000)
                                return {name:currentSong.track.name, duration:parseFloat(time.toFixed(2)), url:currentSong.track.external_urls.spotify}
                            })
                        }).then(dataArray => {
                            return {name: item.name, songs: dataArray, image: item.images ? item.images[0].url:''}
                        })
                    })
                    return Promise.all(PlaylistsObjs)
            })
    
            Promise.all([fetchUserData, fetchUserPlaylists]).then(([userData, playlistsData]) => {
                setServerData({
                    user: {
                        name: userData.display_name,
                        playlists: playlistsData
                    }
                });
            }).catch(error => {
                console.error('Error fetching data:', error);
            });
        }

    }, []);

    return (
        serverData && serverData.user && serverData.user.name ?
            <div className='App'>
                <h1>{serverData.user.name + "'s Playlists" || "Loading"}</h1>
                <TotalPlaylists total={filteredPlaylists.length} />
                <TotalHours hours={hours} />
                <Filter onTextChange={text => setFilterString(text.toLowerCase())} />
                {filteredPlaylists.slice(0,3).map((playlist, index) =>
                    <Playlist name={playlist.name} songs={playlist.songs.slice(0,3).map((value) => value.name)} image={playlist.image} key={index} />
                )}
            </div>
            : searchParams == {}?
                <h1 style={{ textAlign: 'center' }}>Loading... {requestData()}</h1>
                : <h1 style={{ textAlign: 'center' }}>
                    <button className='Sign-in-button' onClick={() => window.location = window.location.href.includes('localhost') 
                    ? 'http://localhost:8888/login/': 'https://oauth-bridge-spotify-project.vercel.app/login'}>
                        <h3>Sign in with Spotify</h3>
                    </button>
                </h1>
    );
}

export default App;
