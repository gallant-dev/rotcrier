import { useEffect, useState } from 'react'
import { Card, Row, Col, Image, Container, Button, Form } from 'react-bootstrap'
import Shit from './Shit'
import editIcon from '../images/icons8-edit-48.png'
import deleteIcon from '../images/icons8-delete-96.png'

function Section(props) {
    const [section, setSection] = useState({})
    const [memberships, setMemberships] = useState([])
    const [moderator, setModerator] = useState({})
    const [isMember, setIsMember] = useState(false)
    const [posts, setPosts] = useState([])
    const [userId, setUserId] = useState()
    const [editing, setEditing] = useState(false)
    const [warning, setWarning] = useState('')


    const fetchData = async() => {
        console.log(props.viewFocus.name)
        await fetch('/sections/'+props.viewFocus.name, {
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
            if (!response.ok) {
                // get error message from body or default to response status 
                const error = (data && data.message) || response.status;
                window.alert(error)
                return Promise.reject(error);
            }
            console.log(data)

            setSection(data)
            setMemberships(data.members)
            setModerator(data.members[0])
            setPosts(data.Posts)
            setUserId(sessionStorage.getItem('id'))
            const membership = membershipCheck(data.members, sessionStorage.getItem('id'))
            console.log(membership)
            setIsMember(membership)

        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }



    useEffect(() => {  
        fetchData();

    }, [props.viewFocus])

    const submitEditHandler = async(event) => {
        //Prevent the default page refresh on submit.
        event.preventDefault();
        //Create a form object containing the elements.
        const form = event.target.elements
        await fetch('/sections', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: section.title,
                description: form.description.value,
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
            setEditing(false)
            setSection(data)
            setMemberships(section.members)
            setPosts(section.Posts)
            setWarning("")
            console.log(data);
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    const editingButtonHandler = (value) => {
        setEditing(value)
    }

    const deleteButtonHandler = async() => {
        if(!window.confirm("Are you sure you want to delete this section?")){
            return
        }

        await fetch('/sections', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: section.title,
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

            props.onFocusChange({type: "menu", name: "Home"})
            console.log(data);
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    const membershipCheck = (members, id) => {
        let membership = false
        console.log(members)
        for(let i = 0; i < members.length; i++){
            if(members[i].id == id){
                membership = true
            }
        }

        console.log(members, id, membership)
        return membership;
    }

    const joinButtonClickHandler = async(isMember) => {

        const url = isMember ? '/users/memberships/remove/' : '/users/memberships/add/'
        console.log(section.title)
        await fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                displayName: sessionStorage.getItem('displayName'),
                title: section.title,
                session: sessionStorage.getItem('session')
            }),
            credentials: 'include'
        })
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('applickaation/json');
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
            setIsMember(!isMember)
            fetchData()
            props.onFocusChange({type: "section", name: section.title})
            console.log(data)
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    return(
    <Row>
        <Row>
            <Col xs={10} sm={10} md={10} lg={9} xl={8}>
                <h1>{section && section.title}</h1>
                <h6>Moderator: {moderator && moderator.displayName}</h6>
                {!editing && <span>{section && section.description}</span>}
                <h6>{memberships && memberships.length} Members</h6>
                <Button onClick={event => joinButtonClickHandler(isMember)}>{!isMember ? 'Become member' : 'Cancel membership'}</Button>

                {editing && 
                <Form onSubmit={event => submitEditHandler(event)}>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control required as="textarea" rows={8} defaultValue={section.description}></Form.Control>
                    </Form.Group>
        
                    <Form.Group controlId="formButtons">
                        <Button variant="primary" className="m-2" onClick={event => editingButtonHandler(false)}>
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
                }
            </Col>
            <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                {section.UserId == userId && 
                    <>
                        <Image className="edit p-1"
                        width={25}
                        height={25}
                        src={editIcon}
                        alt="Edit"
                        onClick={event => editingButtonHandler(true)}
                        />

                        <Image className="delete p-1"
                        width={25}
                        height={25}
                        src={deleteIcon}
                        alt="Delete"
                        onClick={event => deleteButtonHandler()}
                        />
                    </>
                }
            </Col>
        </Row>
        <Container>
            {(posts.length > 0 ) &&
            posts.map( post => 
                <Card key={post.id+post.title} onClick={event => props.onFocusChange({type: 'post', name: post.title})}>
                    <Card.Body>
                        <Row>
                            <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                                <Shit shitFor={{type: 'post', id: post.id}} />
                            </Col>
                            <Col xs={10} sm={10} md={10} lg={9} xl={8}>
                                <Card.Title>{
                                    post.title.length > 125 ?
                                    post.title.substring(0, 125)+'...' :
                                    post.title
                                    }
                                </Card.Title>
                                <Card.Text>
                                {
                                    post.body.length > 125 ?
                                    post.body.substring(0, 125)+'...' :
                                    post.body
                                    }
                                </Card.Text>
                            </Col>
                        </Row>

                    </Card.Body>
                </Card> 
            )}
        </Container>
    </Row>
    );
}

export default Section