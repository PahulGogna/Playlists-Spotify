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
        for (let i = 0; i < playlist.songs.length; i++) {
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
        console.log(searchParams);
        let accessToken = searchParams.access_token;
        console.log(accessToken)
        if (accessToken){
            const fetchUserData = fetch('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            }).then(response => response.json());
    
            const fetchUserPlaylists = fetch('https://api.spotify.com/v1/me/playlists', {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            }).then(response => response.json());
    
            Promise.all([fetchUserData, fetchUserPlaylists]).then(([userData, playlistsData]) => {
                let responsePlaylists = [];
                for (let i = 0; i < playlistsData.total; i++) {
                    responsePlaylists.push({ name: playlistsData.items[i].name, songs: [] , image: playlistsData.items[i].images ? playlistsData.items[i].images[0].url:''});
                }
    
                setServerData({
                    user: {
                        name: userData.display_name,
                        playlists: responsePlaylists
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
                {filteredPlaylists.map((playlist, index) =>
                    <Playlist name={playlist.name} songs={playlist.songs.map((value) => value.name)} image={playlist.image} key={index} />
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
