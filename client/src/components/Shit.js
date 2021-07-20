import { useState, useEffect } from 'react'
import { Image } from 'react-bootstrap'
import shitIcon from '../images/icons8-triangle-48.png'
import noShitIcon from '../images/icons8-triangle-48-none.png'

function Shit(props){
    const[shit, setShit] = useState()
    const[shitFor, setShitFor] = useState(props.shitFor)
    const[shitGiven, setShitGiven] = useState(false)

    const fetchData = async() => {
        const url = '/shits/'+shitFor.type+'/'+shitFor.id
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

            setShit(data)
            setShitGiven(true)
            console.log(data);

        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    useEffect(() => {

        fetchData();

    }, [props.viewFocus])

    const clickShitHandler = async() => {
        if(!shitGiven){
            const PostId = shitFor.type == 'post' ? shitFor.id : null
            const CommentId = shitFor.type == 'comment' ? shitFor.id : null
            console.log(PostId+' '+CommentId)
            await fetch('/shits', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserId: sessionStorage.getItem('id'),
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
                setShit(data)
                setShitGiven(true)
                console.log(data);
            })
            .catch(error => {
                console.error('Error! ', error);
            })
        }
        else{
            await fetch('/shits', {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: shit.id,
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
                setShitGiven(false)
                console.log(data);
            })
            .catch(error => {
                console.error('Error! ', error);
            })
        }

    }

    return(
        <Image  onClick={event => clickShitHandler()} width={35}
        height={35} src={shitGiven ? shitIcon : noShitIcon}></Image>
    );
}

export default Shit