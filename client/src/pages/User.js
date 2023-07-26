import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, Row, Col, Container } from 'react-bootstrap'
import Shit from '../components/Shit'

function User(props){
    const [user, setUser] = useState({})
    const [posts, setPosts] = useState([])
    const [sections, setSections] = useState([])
    const [comments, setComments] = useState([])
    const [shits, setShits] = useState([])
    const [postShits, setPostShits] = useState(0)
    const [commentShits, setCommentShits] = useState(0)


    const fetchData = async() => {
        console.log(props.viewFocus.name)
        await fetch('/api/users/'+props.viewFocus.name, {
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
            setUser(data)
            const postArray = data.Posts.sort((a, b) => b.Shits.length - a.Shits.length)
            setPosts(postArray)
            setSections(data.Sections)
            const commentArray = data.Comments.sort((a, b) => b.Shits.length - a.Shits.length)
            setComments(commentArray)
            setShits(data.Shits)
            setPostShits(shitCount(data.Posts))
            setCommentShits(shitCount(data.Comments))
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }



    useEffect(() => {  
        fetchData();

    }, [props.viewFocus])

    const shitCount = (userData) => {
        let postShits = 0;
        for(let i = 0; i < userData.length; i++){
            const shits = userData[i].Shits.length
            postShits += shits
        }

        return postShits;
    }
    
    return(
        <Container>
            <Row className="pb-2">
                <h1>{user.displayName}'s Profile</h1>
                <span className="ps-4">{shits.length} shits given!</span>
            </Row>
            <Row>
                <Col xs={12} sm={12} md={12} lg={6} xl={5}>
                    <Row>
                        <Col>
                            <h2>Posts</h2>
                        </Col>
                        <Col>
                            <span className="p-0">{postShits} shits recieved on posts</span>
                        </Col>
                    </Row>

                    {(posts.length > 0 ) ?
                        posts.map( post => 
                            <Card key={post.id+post.title}>
                                <Card.Body>
                                    <Row>
                                            <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                                <Shit shitFor={{type: 'post', id: post.id}} />
                                            </Col>
                                            <Col xs={10} sm={10} md={10} lg={9} xl={8} onClick={() => props.onFocusChange({type: 'post', name: post.title})}>
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
                        ) : "0 found"}
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={4} className="pt-2">
                    <Row>
                        <Col>
                            <h2>Comment</h2>
                        </Col>
                        <Col>
                            <span className="p-0">{commentShits} shits recieved on comments</span>
                        </Col>
                    </Row>
                            {(comments.length > 0 ) ?
                        comments.map( comment => 
                        <Card key={comment.id+user.displayName} onClick={() => props.onFocusChange({type: 'post', name: comment.Post.title})}>
                            <Card.Body>
                                <Row>
                                    <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                        <Shit shitFor={{type: 'comment', id: comment.id}} />
                                    </Col>
                                    <Col xs={10} sm={10} md={10} lg={9} xl={8}>
                                        <Card.Title>{
                                            user.displayName.length > 125 ?
                                            user.displayName.substring(0, 125)+'...' :
                                            user.displayName
                                            } on 
                                            "{comment.Post?
                                                (comment.Post.title.length > 125) ?
                                                comment.Post.title.substring(0, 125)+'...' :
                                                comment.Post.title
                                                : ""}
                                            {comment.parent ?
                                                (comment.parent.body.length > 125) ?
                                                comment.parent.body.substring(0, 125)+'...' :
                                                comment.parent.body
                                                : ""}"
                                        </Card.Title>
                                        <Card.Text>
                                            {comment.body}
                                        </Card.Text>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card> 
                ) : "0 found"}
                    </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={3} className="pt-2">
                    <h2>Sections</h2>
                    {(sections.length > 0 ) ?
                    sections.map( section => 
                    <Card key={section.id+section.title} onClick={() => props.onFocusChange({type: 'section', name: section.title})}>
                        <Card.Body>
                            <Link to={`/section/${encodeURIComponent(section.title)}`} style={{all: 'unset'}}>
                                <Card.Title>{
                                    section.title.length > 125 ?
                                    section.title.substring(0, 125)+'...' :
                                    section.title
                                    }
                                </Card.Title>
                                <Card.Text>
                                {
                                    section.description.length > 125 ?
                                    section.description.substring(0, 125)+'...' :
                                    section.description
                                    }
                                </Card.Text>
                            </Link>
                        </Card.Body>
                    </Card> 
                    ) : "0 found" }      
                </Col>
            </Row>
        </Container>
    );
}

export default User