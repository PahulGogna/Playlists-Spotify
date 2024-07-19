
function TotalPlaylists(props){
    return (
        <div style={{width: '40%', display: 'inline-block', margin:'5px'}}>
            {<h2>{props.total > 1 ? props.total + " Playlists": props.total + " Playlist"}</h2>}
        </div>
    )
}

export default TotalPlaylists
