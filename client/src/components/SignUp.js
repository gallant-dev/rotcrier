import { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'

function SignUp(props) {
    const [show, setShow] = useState(false)
    const [warning, setWarning] = useState("")

    const handleClose = () => {
        setWarning("")
        setShow(false)
    }

    const handleShow = () => setShow(true);

    const submitHandler = async(event) => {
        event.preventDefault();
        const form = event.target.elements
        await fetch('/users', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                displayName: form.displayNameInput.value,
                email: form.emailInput.value,
                password: form.passwordInput.value
            }),
            credentials: 'include'
        })
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();
            

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                setWarning(data);
                return Promise.reject(error);
            }
            sessionStorage.setItem('displayName', data.displayName)
            sessionStorage.setItem('session', data.session)
            props.onLogin();
            console.log(data);
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    return(
        <>
      <Button variant="primary" onClick={handleShow}>
        Sign up
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Sign up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={event =>submitHandler(event)}>
            <Form.Group controlId="displayNameInput">
                <Form.Label>Display name</Form.Label>
                <Form.Control type="text" placeholder="Enter display name" />
                <Form.Text className="text-muted">
                This will be your identity with your fellow shit givers.
                </Form.Text>
            </Form.Group>
            <Form.Group controlId="emailInput">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group controlId="passwordInput">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Modal.Footer>
                <Form.Label style={{color: "red"}}>
                    {warning}
                </Form.Label>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" type="submit">Submit</Button>
                </Modal.Footer>
            </Form> 
        </Modal.Body>
      </Modal>
    </>
    );
}

export default SignUp;