
function Aggregate(props){
    return (
        <div style={{width: '40%', display: 'inline-block', margin:'5px'}}>
            {props.number && props.name && <h2>{props.number + " " + props.name}</h2>}
        </div>
    )
}

export default Aggregate