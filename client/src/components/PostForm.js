import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { useState } from 'react'


//The funcionality behind post creation. Users create posts which their peers and themselves can post
//things that they don't like. This form makes a fetch request to the API to confirm credentials, and create
//a new custom section with them. 
function PostForm(props) {
    //A default empty warning state that can be used to populate warnings displayed in response from the server.
    const [warning, setWarning] = useState('')
    const [defaultSection, setDefaultSection] = useState('')

    //The submitHandler is an async function that makes a fetch request to the api, and confirms validitiy of session
    //credentials and creates a new session if authorized.
    const submitHandler = async(event) => {
        //Prevent the default page refresh on submit.
        event.preventDefault();
        const UserId = sessionStorage.getItem('id')
        if(!UserId){
            return window.alert("You must be logged in to comment!")
        }
        //Create a form object containing the elements.
        const form = event.target.elements
        await fetch('/posts', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: form.postTitle.value.normalize(),
                body: form.body.value.normalize(),
                sectionTitle: form.sectionTitle.value.normalize(),
                UserId: sessionStorage.getItem('id'),
                session: sessionStorage.getItem('session')
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
            props.onFocusChange({type: 'post', name: data.title})
            setWarning("")
            console.log(data);
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    //Sets the focus to "Home" on cancellation.
    const cancelHandler = () => {
        props.onFocusChange({type: 'menu', name: 'Home'})
    }
    
    return(
        <Container>
            <Row className="justify-content-center">
                <Col  xs={12} sm={12} md={8} lg={8} xl={6}>
                    <Form onSubmit={event => submitHandler(event)}>
                        <Form.Group controlId="postTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control required type="text" placeholder="Your new post's title" />

                        </Form.Group>
                        <Form.Group controlId="sectionTitle">
                            <Form.Label>Section</Form.Label>
                            <Form.Control defaultValue={props.defaultSection} required type="text" placeholder="What section would you like to post in?" />
                        </Form.Group>

                        <Form.Group controlId="body">
                            <Form.Label>Body</Form.Label>
                            <Form.Control required as="textarea" rows={8} placeholder="What message would you like to share?" />
                        </Form.Group>

                        <Form.Group controlId="formButtons">
                            <Button variant="primary" className="m-2" onClick={cancelHandler}>
                                Cancel
                            </Button>

                            <Button variant="primary" className="m-2" type="submit">
                                Submit
                            </Button>
                            <Form.Label style={{color: "red"}}>
                                {warning}
                            </Form.Label>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>

    );
}
export default PostForm