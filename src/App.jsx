import { useState, useEffect } from 'react'
import Aggregate from './Aggregate'
import Filter from './Filter'
import Playlist from './Playlist'

function App() {
    const fakeSeverData = {
        user:{
            name:'D',
            playlists:[
                {name:'Liked', 
                    songs: ["song 1", "song 2", "song 3"]
                },
                {name: 'New Releases',
                    songs:["song 1", "song 2", "song 3"]
                },
                {name: 'Saved',
                    songs:["song 1", "song 2", "song 3"]
                },
                {name: 'Downloads',
                    songs:["song 1", "song 2", "song 3"]
                },
            ]
        }
    }

    const [serverData, setServerData] = useState({});



    useEffect( () => {
        setTimeout(
        () => {setServerData(fakeSeverData)}, 500)
    },[]);
    

    return ( <div className='App'>
                <h1>{(serverData.user && serverData.user.name) || "Loading Playlists..."}</h1>
                <Aggregate number={serverData.user && serverData.user.playlists.length} name='Playlists'/>
                <Aggregate number='20'/>
                <Filter/>
                {serverData.user && serverData.user.playlists.map((playist)=>
                    <Playlist name={playist.name} songs={playist.songs}/>   
                )}
            </div>
        )
}

export default App
