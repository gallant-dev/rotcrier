import { Form, Button } from 'react-bootstrap'
import { useState } from 'react'

function CommentForm(props) {
    //A default empty warning state that can be used to populate warnings displayed in response from the server.
    const [warning, setWarning] = useState('')

    //The submitHandler is an async function that makes a fetch request to the api, and confirms validitiy of session
    //credentials and creates a new session if authorized.
    const submitHandler = async(event) => {
        //Prevent the default page refresh on submit.
        event.preventDefault();
        //Create a form object containing the elements.
        const form = event.target.elements
        console.log(props.commentTarget.id)
        const PostId = props.commentTarget.type == 'post' ? props.commentTarget.id : null
        const CommentId = props.commentTarget.type == 'comment' ? props.commentTarget.id : null
        await fetch('/comments', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                body: form.body.value,
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
                setWarning(data);
                return Promise.reject(error);
            }
            //Call the function in the parent to set behaviour after form submission, set the warning and log
            //the data to the console.
            props.onCommentSubmit()
            setWarning('')
            event.target.reset()
            console.log(data);
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    return(
        <Form onSubmit={event => submitHandler(event)}>
            <Form.Group controlId="body">
                <Form.Label>Comment</Form.Label>
                <Form.Control required as="textarea" rows={8} placeholder="What comment would you like to make?" />
            </Form.Group>

            <Form.Group controlId="formButtons">
                <Button variant="primary" className="m-2" type="submit">
                    Submit
                </Button>
                <Form.Label style={{color: "red"}}>
                    {warning}
                </Form.Label>
            </Form.Group>
        </Form>
    );
}

export default CommentForm