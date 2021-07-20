import { useEffect, useState } from 'react'
import { Button, Row, Col, Image, Form } from 'react-bootstrap'
import editIcon from '../images/icons8-edit-48.png'
import deleteIcon from '../images/icons8-delete-96.png'
import CommentForm from './CommentForm'
import Comment from './Comment'
import Shit from './Shit'

function Post(props) {
    const [post, setPost] = useState({})
    //Had to set state of section seperately because react is returning null when I access
    //the section title through the render component on first load only. If the code is edited
    //and the same code is pasted during run the section title is obtained correctly. Also if I
    //define the section here seperately from the post it renders correctly. It is almost as if 
    //in react it starts rendering prior to getting the nested section data.
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
            

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status 
                const error = (data && data.message) || response.status;
                console.log(error)
                return Promise.reject(error);
            }

            setUserId(sessionStorage.getItem('id'))
            setSection(data.Section)
            setComments(data.Comments)
            setPost(data)
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

    const removeFromParentArray = (remove) => {
        const index = comments.findIndex(comment => comment.id === remove.id)
        console.log(index)
        console.log(remove)
        if(index > -1) {
            let newArray = comments.splice(index, 1)
            setComments(newArray)
        }

        console.log(comments)
    }

    return(
        <div>
            <Row className="justify-content-start">
                <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                   {post.id && <Shit shitFor={{type: 'post', id: post.id.toString()}} />}
                </Col>
                <Col xs={10} sm={10} md={10} lg={9} xl={8}>
                    {section && <h2 onClick={event => props.onFocusChange({type: "section", name: section.title})} value={section.title}>/{section.title}/</h2>}
                    <h1>{post.title}</h1>
                    {!editing && <span>{post.body}</span>}
                    {editing && 
                    <Form onSubmit={event => submitEditHandler(event)}>
                        <Form.Group controlId="body">
                            <Form.Label>Body</Form.Label>
                            <Form.Control required as="textarea" rows={8}>{post.body}</Form.Control>
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
                {post.UserId == userId && 
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
            <Row className="justify-content-center">
                <Col >
                {(!showCommentForm || commentTarget.type != "post") && <Button active={false} onClick={event => commentButtonHandler(!showCommentForm)} variant="secondary">Comment</Button>}
                </Col>

                {(commentTarget.type === "post" && showCommentForm)  && <CommentForm onCommentSubmit={commentSubmitHandler} commentTarget={commentTarget}/>}
            </Row>
            {comments.length > 0 && comments.map( comment => <Comment key={comment.id} removeFromParentArray={removeFromParentArray} onFocusChange={props.onFocusChange} viewFocus={props.viewFocus} comment={comment} commentTarget={commentTarget} onCommentTargetChange={commentTargetHandler}></Comment>)}
        </div>

    );
}

export default Post