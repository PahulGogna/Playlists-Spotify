import { useState, useEffect } from 'react'
import TotalPlaylists from './TotalPlaylists'
import Filter from './Filter'
import Playlist from './Playlist'
import TotalHours from './TotalHours'

function App() {
    const fakeSeverData = {
        user:{
            name:'D',
            playlists:[
                {name:'Liked', 
                    songs: [{name:"song1", duration:1453},
                            {name: "song2", duration:324},
                            {name:'song3', duration:2341}]
                },
                {name: 'New Releases',
                    songs: [{name:"song4", duration:1453},
                            {name: "song5", duration:324},
                            {name:'song6', duration:2341}]
                },
                {name: 'Saved',
                    songs: [{name:"song7", duration:1453},
                            {name: "song8", duration:324},
                            {name:'song9', duration:2341}]
                },
                {name: 'Downloads',
                    songs: [{name:"song10", duration:1453},
                            {name: "song11", duration:324},
                            {name:'song12', duration:2341}]
                },
            ]
        }
    }

    const [serverData, setServerData] = useState({});
    const [filterString, setFilterString] = useState('');


    useEffect( () => {
        setTimeout(
            () => {setServerData(fakeSeverData)}, 500
        )
    },[]);

    const hours = serverData.user ? serverData.user.playlists.reduce(function(sum, currentPlaylist){
                    for(let i = 0; i < currentPlaylist.songs.length; i++){
                        sum += (currentPlaylist.songs[i].duration)
                    }
                    return sum
                },0):0;
    
    
    return ( serverData.user ? <div className='App'>
                <h1>{(serverData.user.name + "'s Playlists" || "Loading")}</h1>
                <TotalPlaylists total={serverData.user.playlists.length}/>
                <TotalHours hours = {hours}/>
                {<Filter onTextChange={text => setFilterString(text.toLowerCase())}/>}
                {serverData.user.playlists.filter(playlist => {
                    let names = playlist.name.toLowerCase().includes(filterString)
                    let songs = false
                    for (let i = 0; i < playlist.songs.length; i++){
                        if (playlist.songs[i].name.toLowerCase().includes(filterString)){
                            songs = true
                            break
                        }
                    }
                    return names || songs
                }
                ).map((playlist, index)=>
                    <Playlist name={playlist.name} songs={playlist.songs.map((value)=> {
                        return value.name
                    })} key={index}/>
                )}
            </div> : <h1 style={{textAlign:'center'}}> Loading... </h1>
        )
}

export default App
