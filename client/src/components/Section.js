import { useEffect, useState } from 'react'
import { Card, Row, Col, Image, Container, Button, Form } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import Shit from './Shit'
import editIcon from '../images/icons8-edit-48.png'
import deleteIcon from '../images/icons8-delete-96.png'

function Section(props) {
    const name = useParams()
    const [section, setSection] = useState({})
    const [memberships, setMemberships] = useState([])
    const [moderator, setModerator] = useState({})
    const [isMember, setIsMember] = useState(false)
    const [posts, setPosts] = useState([])
    const [editing, setEditing] = useState(false)
    const [warning, setWarning] = useState('')
    const userId = props.userId;

    const fetchSection = async() => {
        await fetch('/api/sections/'+encodeURIComponent(props.viewFocus.name), {
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
            const postArray = data.Posts.sort((a, b) => b.Shits.length - a.Shits.length)
            setPosts(postArray)
            setMemberships(data.members)
            setModerator(data.members[0])
            const membership = membershipCheck(data.members, sessionStorage.getItem('id'))
            setIsMember(membership)

        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }



    useEffect(() => {  
        fetchSection()

    }, [props.viewFocus])

    const submitEditHandler = async(event) => {
        //Prevent the default page refresh on submit.
        event.preventDefault();
        //Create a form object containing the elements.
        const form = event.target.elements
        await fetch('/api/sections', {
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
            const postArray = section.Posts.sort((a, b) => b.Shits.length - a.Shits.length)
            setPosts(postArray)
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

        await fetch('/api/sections', {
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
        for(let i = 0; i < members.length; i++){
            if(members[i].id == id){
                membership = true
            }
        }

        return membership;
    }

    const joinButtonClickHandler = async(isMember) => {
        if(!userId){
            return window.alert("You must be logged in to join!")
        }
        if(section.UserId == userId){
            return window.alert("You are the moderator you can't abandon your section!")
        }
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
            fetchSection()
            props.onFocusChange({type: "section", name: section.title})
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    const makePostButtonHandler = () => {
        props.onMakePost(section.title);
        props.onFocusChange({type: 'menu', name: 'Create a new post'})
    }

    return(
    <Container className="pb-3">
        <Row className="mb-3">
            <Col xs={10} sm={10} md={10} lg={9} xl={8}>
                <h1>{section && section.title}</h1>
                <h6 onClick={() => props.onFocusChange({type: 'user', name: moderator.displayName})}>Moderator: {moderator && moderator.displayName}</h6>
                {!editing && <span>{section && section.description}</span>}
                <h6>{memberships && memberships.length} Members</h6>
                <Button variant="secondary" onClick={event => joinButtonClickHandler(isMember)}>{!isMember ? 'become member' : 'cancel membership'}</Button>
                {isMember && <Button variant="secondary" className="ms-3" onClick={() => makePostButtonHandler()}>make a post</Button>}
                {editing && 
                <Form onSubmit={event => submitEditHandler(event)}>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control required as="textarea" rows={8} defaultValue={section.description}></Form.Control>
                    </Form.Group>
        
                    <Form.Group controlId="formButtons">
                        <Button variant="primary" className="m-2" onClick={() => editingButtonHandler(false)}>
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
                        onClick={() => editingButtonHandler(true)}
                        />

                        <Image className="delete p-1"
                        width={25}
                        height={25}
                        src={deleteIcon}
                        alt="Delete"
                        onClick={() => deleteButtonHandler()}
                        />
                    </>
                }
            </Col>
        </Row>
        <Container>
            {(posts.length > 0 ) &&
            posts.map( post => 
                <Card key={post.id+post.title} onClick={() => props.onFocusChange({type: 'post', name: post.title})}>
                    <Card.Body>
                        <Row>
                            <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                                <Shit shitFor={{type: 'post', id: post.id}} />
                            </Col>
                            <Col xs={10} sm={10} md={10} lg={9} xl={8}>
                                <Link to={`/post/${post.id}`} style={{all: 'unset'}}>
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
                                </Link>
                            </Col>
                        </Row>

                    </Card.Body>
                </Card> 
            )}
        </Container>
    </Container>
    );
}

export default Section