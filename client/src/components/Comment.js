import { useState, useEffect } from 'react'
import { Card, Button } from 'react-bootstrap'
import CommentForm from './CommentForm'

function Comment(props) {
    const[comment, setComment] = useState(props.comment)
    const[comments, setComments] = useState([])
    const[showCommentForm, setShowCommentForm] = useState(false)

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
            

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status 
                const error = (data && data.message) || response.status;
                console.log(error)
                return Promise.reject(error);
            }
            console.log(data);
            setComment(data)
            setComments(data.Comments)
            console.log(comments);

        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    useEffect(() => {

        fetchData();

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

    return (
        <Card className="mt-1">
            <Card.Header>{comment.User.displayName}</Card.Header>
            <Card.Body>
                <Card.Text>
                    {comment.body}
                </Card.Text>
                {(!showCommentForm || !(props.commentTarget.type == 'comment' &&
                 props.commentTarget.id == comment.id)) && <Button active={false} onClick={event => commentButtonHandler(!showCommentForm)} variant="primary">Comment</Button>}
                {(showCommentForm && (props.commentTarget.type == 'comment' &&
                 props.commentTarget.id == comment.id)) && <CommentForm onCommentSubmit={commentSubmitHandler} commentTarget={{type: 'comment', id: comment.id}}/>}
                {comments.length > 0 && comments.map( comment => <Comment comment={comment} commentTarget={props.commentTarget} onCommentTargetChange={commentTargetHandler}></Comment>)}
            </Card.Body>
        </Card>
    );
}

export default Comment