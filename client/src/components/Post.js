import { useEffect, useState } from 'react'
import { Button, Row, Col, Image, Form, Container } from 'react-bootstrap'
import editIcon from '../images/icons8-edit-48.png'
import deleteIcon from '../images/icons8-delete-96.png'
import CommentForm from './CommentForm'
import Comment from './Comment'
import Shit from './Shit'
import parse from 'html-react-parser';

function Post(props) {
    const [post, setPost] = useState({})
    const [creator, setCreator] = useState({})
    const [section, setSection] = useState({})
    const [comments, setComments] = useState([])
    const [userId, setUserId] = useState()
    const [commentTarget, setCommentTarget] = useState({type: 'post', id: null})
    const [showCommentForm, setShowCommentForm] = useState(true)
    const [editing, setEditing] = useState(false)
    const [warning, setWarning] = useState('')

    const commentTargetHandler = (value) => {
        setCommentTarget({type: 'comment', id: value})
    }

    const commentSubmitHandler = () => {
        fetchData()
        setShowCommentForm(false)
    }

    const commentButtonHandler = (value) => {
        if(showCommentForm && !(commentTarget.type == 'post' &&
        commentTarget.id == post.id)){
            setCommentTarget({type: 'post', id: post.id})
        }
        else{
            setShowCommentForm(value)
            setCommentTarget({type: 'post', id: post.id})
        }
    }

    const editingButtonHandler = (value) => {
        setEditing(value)
    }

    const deleteButtonHandler = async() => {
        if(!window.confirm("Are you sure you want to delete this post?")){
            return
        }

        await fetch('/posts', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: post.id,
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


    const fetchData = async() => {
        const url = '/posts/'+encodeURIComponent(props.viewFocus.name)
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
            

            // If the response is not okay return the error message.
            if (!response.ok) {
                const error = (data && data.message) || response.status;
                console.log(error)
                return Promise.reject(error);
            }
            setPost(data)
            setUserId(sessionStorage.getItem('id'))
            setSection(data.Section)
            const postOnlyCommentArray = data.Comments.filter((value, index) => { return value.CommentId == null })
            const commentArray = postOnlyCommentArray.sort((a, b) => b.Shits.length - a.Shits.length)
            setComments(commentArray)     
            setCreator(data.User)
            setCommentTarget({type: 'post', id: data.id})
            console.log(data);
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
        await fetch('/posts', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: post.id,
                title: post.title,
                body: form.body.value,
                UserId: sessionStorage.getItem('id'),
                SectionId: section,
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
            setPost(data)
            setWarning("")
            console.log(data);
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    const Body = (props) => {
        if(!props.body){
            return
        }
            console.log(props.body)
        const text = props.body;

        const regex = /(((https?:\/\/)|(www\.))[^\s]+)/g
        const body = text.replace(regex, (url) => {
            let hyperlink = url
            if(!hyperlink.match('^https?:\/\/')){
                hyperlink = 'https://'+hyperlink
            }
            return '<a href="'+hyperlink+'">'+hyperlink+'</a>';
        })
        return (
            <div className="pb-4 text-break">{parse(body)}</div>
        );
    }

    return(
        <Container className="pb-3">
            <Row>
                <Col>
                    <Row>
                        <Col xs={3} sm={2} md={2} lg={1} xl={1}>
                            <Row>
                                {post.id && <Shit shitFor={{type: 'post', id: post.id}} />}
                            </Row>
                        </Col>
                        <Col xs={9} sm={10} md={10} lg={11} xl={11}>
                            <Row>
                                {section && <h4 className="pb-2 text-break" onClick={event => props.onFocusChange({type: "section", name: section.title})} value={section.title}>/{section.title}/</h4>}
                            </Row>
                            <h1 className="pb-2">{post.title}</h1>
                            <Row className="pb-3 justify-content-between">
                                <Col xs={12} sm={7} md={7} lg={7} xl={7} xxl={7}>
                                    <h6 className="text-break" onClick={() => props.onFocusChange({type: 'user', name: creator.displayName})}>creator: {creator.displayName}</h6>
                                </Col>
                                <Col xs={12} sm={2} md={2} lg={2} xl={2} xxl={1}>
                                    {post.UserId == userId && 
                                        <>
                                            <Image className="edit p-1"
                                            width={25}
                                            height={25}
                                            src={editIcon}
                                            alt="Edit"
                                            onClick={event => editingButtonHandler(true)}
                                            />
                                        </>
                                    }
                                    {(post.UserId == userId || section.UserId == userId) && 
                                        <>
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
                            <Row>
                                <Col xs={9} sm={10} md={10} lg={11} xl={11}>
                                    {(!editing && post.body) && <Body body={post.body}></Body>}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="justify-content-center pt-4">
                        {editing && 
                        <Form onSubmit={event => submitEditHandler(event)}>
                            <Form.Group controlId="body">
                                <Form.Label>Body</Form.Label>
                                <Form.Control required as="textarea" rows={8} defaultValue={post.body}></Form.Control>
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
                        <Col xs={12} sm={11} md={11} lg={11} xl={10} xxl={10}>
                            {(commentTarget.type === "post" && showCommentForm && !editing)  && <CommentForm post={post} onCommentSubmit={commentSubmitHandler} commentTarget={commentTarget}/>}
                            <Row className="pb-4">
                                <Col >
                                {(!showCommentForm || commentTarget.type != "post") && <Button className="mb-3" active={false} onClick={event => commentButtonHandler(!showCommentForm)} variant="secondary">comment</Button>}
                                </Col>
                            </Row>
                            <Row className="p-2">
                                <hr />
                                <h6>Comments:</h6>
                                {comments.length > 0 && comments.map( comment => <Comment section={section} post={post} key={comment.id} onFocusChange={props.onFocusChange} viewFocus={props.viewFocus} comment={comment} commentTarget={commentTarget} onCommentTargetChange={commentTargetHandler}></Comment>)}
                            </Row>
                        </Col>
                    </Row>             
                </Col>
            </Row>
        </Container>
    );
}

export default Post