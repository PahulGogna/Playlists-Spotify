
function TotalHours(props){
    // console.log(props.hours)

    return (
        <div style={{width: '40%', display: 'inline-block', margin:'5px'}}>
            <h2>{props.hours > 1? props.hours + " Hours": props.hours + " Hour"}</h2>
        </div>
    )
}

export default TotalHours