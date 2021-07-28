import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { useState } from 'react'


//The funcionality behind section creation. Users create sections which their peers and themselves can post
//things that they don't like. This form makes a fetch request to the API to confirm credentials, and create
//a new custom section with them. 
function SectionForm(props) {
    //A default empty warning state that can be used to populate warnings displayed in response from the server.
    const [warning, setWarning] = useState("")

    //The submitHandler is an async function that makes a fetch request to the api, and confirms validitiy of session
    //credentials and creates a new session if authorized.
    const submitHandler = async(event) => {
        //Prevent the default page refresh on submit.
        event.preventDefault();
        //Create a form object containing the elements.
        const form = event.target.elements
        await fetch('/sections', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: form.sectionTitle.value,
                description: form.description.value,
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
                //setWarning(data);
                return Promise.reject(error);
            }
            //Call the function in the parent to set behaviour after form submission, set the warning and log
            //the data to the console.
            console.log(data.title)
            props.onFocusChange({type: 'section', name: data.title})
            setWarning("")
            console.log(data);
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    //Sets the focus to "Home" on cancellation.
    const cancelHandler = () => {
        props.onFocusChange("Home")
    }
    
    return(
        <Container>
            <Row className="justify-content-center">
                <Col  xs={12} sm={12} md={8} lg={8} xl={6}>
                    <Form onSubmit={event => submitHandler(event)}>
                        <Form.Group controlId="sectionTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Your new section's title" />
                            <Form.Label style={{color: "red"}}>
                                {warning}
                            </Form.Label>
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={8} placeholder="A brief description of the section" />
                        </Form.Group>

                        <Form.Group controlId="formButtons">
                            <Button variant="primary" className="m-2" onClick={cancelHandler}>
                                Cancel
                            </Button>

                            <Button variant="primary" className="m-2" type="submit">
                                Submit
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>

    );
}
export default SectionForm