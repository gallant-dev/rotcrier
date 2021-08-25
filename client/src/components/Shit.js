import { useState, useEffect } from 'react'
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap'
import shitIcon from '../images/shit.png'
import noShitIcon from '../images/no-shit.png'

function Shit(props){
    const[shits, setShits] = useState([])
    const[shitFor, setShitFor] = useState(props.shitFor)
    const[shitGiven, setShitGiven] = useState(false)

    const fetchData = async() => {
        const url = '/api/shits/'+shitFor.type+'/'+shitFor.id
        await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },  
            credentials: 'include'
        })
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();
            

            // check for error response
            if (!response.ok && (response.status != 409)) {
                // get error message from body or default to response status 
                const error = (data && data.message) || response.status;
                console.log(error)
                return Promise.reject(error);
            }     
            let shitGiven = false
            for(let i = 0; i < data.length; i++){
                if(data[i].UserId == sessionStorage.getItem('id')){
                    shitGiven = true
                }
            }
            setShits(data)
            setShitGiven(shitGiven)

        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    useEffect(() => {
        fetchData();

    }, [props.viewFocus])

    const clickShitHandler = async() => {
        const UserId = sessionStorage.getItem('id')
        const PostId = shitFor.type == 'post' ? shitFor.id : null
        const CommentId = shitFor.type == 'comment' ? shitFor.id : null
        console.log(PostId+' '+CommentId)
        if(!UserId){
            return window.alert("You must be logged in to give a shit!")
        }
        if(!shitGiven){
            await fetch('/api/shits', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserId: UserId,
                    PostId: PostId,
                    CommentId: CommentId,
                    sessionId: sessionStorage.getItem('session')
                }),
                credentials: 'include'
            })
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                
        
                //If the response is not okay (200).
                if (!response.ok) {
                    //Display error message on the UI by setting the warning, and reject.
                    const error = (data && data.message) || response.status;
                    if(error == 409){
                        setShitGiven(true)
                    }
                    return Promise.reject(error);
                }
                //Call the function in the parent to set behaviour after form submission, set the warning and log
                //the data to the console.
                fetchData()
                setShitGiven(true)
                console.log(data);
            })
            .catch(error => {
                console.error('Error! ', error);
            })
        }
        else{
            await fetch('/api/shits', {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserId: UserId,
                    PostId: PostId,
                    CommentId: CommentId,
                    sessionId: sessionStorage.getItem('session')
                }),
                credentials: 'include'
            })
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                
        
                //If the response is not okay (200).
                if (!response.ok) {
                    //Display error message on the UI by setting the warning, and reject.
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                //Call the function in the parent to set behaviour after form submission, set the warning and log
                //the data to the console.
                fetchData()
                setShitGiven(false)
                console.log(data);
            })
            .catch(error => {
                console.error('Error! ', error);
            })
        }

    }

    const renderTooltip = (shitGiven) => (
        <Tooltip id="shit-tooltip" {...props}>
          {!shitGiven ? 'Do you give a shit?' : 'Shit given!'}
        </Tooltip>
      );
      

    return(
        <>
            {<h6 className="mb-1 p-0 text-center">{shits.length}</h6>}
            <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip(shitGiven)}>
                <div className="text-center">
                    <Image className="max-30px" onClick={() => clickShitHandler()} fluid src={shitGiven ? shitIcon : noShitIcon} />
                </div>
            </OverlayTrigger>
        </>

    );
}

export default Shit