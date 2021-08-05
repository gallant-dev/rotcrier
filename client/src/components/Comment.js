import { useState, useEffect } from 'react'
import { Card, Button, Row, Col, Image, Form } from 'react-bootstrap'
import CommentForm from './CommentForm'
import Shit from './Shit'
import editIcon from '../images/icons8-edit-48.png'
import deleteIcon from '../images/icons8-delete-96.png'
import parse from 'html-react-parser';

function Comment(props) {
    const [userId, setUserId] = useState()
    const [comment, setComment] = useState(props.comment)
    const [comments, setComments] = useState([])
    const [showCommentForm, setShowCommentForm] = useState(false)
    const [showComment, setShowComment] = useState(true)
    const [editing, setEditing] = useState(false)
    const [warning, setWarning] = useState('')

    
    const editingButtonHandler = (value) => {
        setEditing(value)
    }

    const deleteButtonHandler = async() => {
        if(!window.confirm("Are you sure you want to delete this comment?")){
            return
        }


        await fetch('/comments', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: comment.id,
                session: sessionStorage.getItem('session')
            }),
            credentials: 'include'
        })
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();
            
    
            //If the response is not okay.
            if (!response.ok) {
                //Display error message on the UI by setting the warning, and reject.
                const error = (data && data.message) || response.status;
                setWarning(data);
                return Promise.reject(error);
            }
            //Calls the function in the parent to set behaviour after form submission, set the warning and log
            //the data to the console.
            setShowComment(false)
            setWarning("")
            console.log(data);
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    const submitEditHandler = async(event) => {
        //Prevent the default page refresh on submit.
        event.preventDefault();
        //Create a form object containing the elements.
        const form = event.target.elements
        await fetch('/comments', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: comment.id,
                body: form.body.value,
                UserId: sessionStorage.getItem('id'),
                PostId: comment.PostId,
                CommentId: comment.CommentId,
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
            setComment(data)
            setComments(data.Comments)
            setWarning("")
            console.log(data);
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }


    const fetchData = async() => {

        await fetch('/comments/'+comment.id, {
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
            

            //If the response is not okay.
            if (!response.ok) {
                //Display error message on the UI by setting the warning, and reject.
                const error = (data && data.message) || response.status;
                console.log(error)
                return Promise.reject(error);
            }
            console.log(data);
            setComment(data)
            const commentArray = data.Comments.sort((a, b) => b.Shits.length - a.Shits.length)
            setComments(commentArray)
            console.log(comments);

        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    useEffect(() => {
        setUserId(sessionStorage.getItem('id'))
        fetchData()

    }, [props.viewFocus])
    
    const commentButtonHandler = (value) => {
        if(showCommentForm && !(props.commentTarget.type == 'comment' &&
        props.commentTarget.id == comment.id)){
            commentTargetHandler(comment.id)
        }
        else{
            setShowCommentForm(value)
            commentTargetHandler(comment.id)
        }
    }

    const commentTargetHandler = (value) => {
        props.onCommentTargetChange(value)
    }

    const commentSubmitHandler = () => {
        fetchData()
        setShowCommentForm(false)
    }

    const CommentBody = () => {
        if(!comment.body){
            return
        }
        const text = comment.body;
        console.log(text)

        const regex = /(((https?:\/\/)|(www\.))[^\s]+)/g
        const body = text.replace(regex, (url) => {
            let hyperlink = url
            if(!hyperlink.match('^https?:\/\/')){
                hyperlink = 'https://'+hyperlink
            }
            return '<a href="'+hyperlink+'">'+hyperlink+'</a>';
        })
        return (
            <>{parse(body)}</>
        );
    }

    return (
        <>
        {showComment &&
            <Card className="p-0">
                <Card.Header>
                    <Row className="justify-content-between">
                        <Col xs={12} sm={7} md={8} lg={8} xl={8}  onClick={() => props.onFocusChange({type: 'user', name: comment.User.displayName})}>
                            {comment.User.displayName}
                        </Col>
                        <Col xs={12} sm={3} md={2} lg={2} xl={2}>
                            {comment.UserId == userId && 
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
                            {(props.section.UserId == userId || comment.UserId == userId) && 
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
                </Card.Header>
                <Card.Body className="ps-1 pe-0 pb-0">
                    <Row>
                        <Col xs={3} sm={2} md={2} lg={2} xl={2}>
                            <Shit shitFor={{type: 'comment', id: comment.id}} />
                        </Col>
                        <Col xs={9} sm={10} md={10} lg={10} xl={10} className="pe-3">
                                <Card.Text>
                                {!editing && <CommentBody />}
                                {editing && 
                                <Form onSubmit={event => submitEditHandler(event)}>
                                    <Form.Group controlId="body">
                                        <Form.Label>Body</Form.Label>
                                        <Form.Control required as="textarea" rows={8}>{comment.body}</Form.Control>
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
                            </Card.Text>

                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                        {(!showCommentForm || !(props.commentTarget.type == 'comment' &&
                            props.commentTarget.id == comment.id)) && <Button className="mb-3" active={false} onClick={event => commentButtonHandler(!showCommentForm)} variant="secondary">comment</Button>}
                            {(showCommentForm && (props.commentTarget.type == 'comment' &&
                            props.commentTarget.id == comment.id)) && <CommentForm post={props.post} onCommentSubmit={commentSubmitHandler} commentTarget={{type: 'comment', id: comment.id}}/>}
                            {comments.length > 0 && comments.map( comment => <Comment onFocusChange={props.onFocusChange} section={props.section} post={props.post} key={comment.id} comment={comment} commentTarget={props.commentTarget} onCommentTargetChange={commentTargetHandler}></Comment>)}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            }
        </>
    );
}

export default Comment